const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const Admin = require("../models/AdminModel");
const OtpMailer = require("../util/OtpMailer");
const ApiError = require("../util/ApiError");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const sendOtpMail = async (email, otp, subjectTitle = "EventSphere") => {
  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: `${subjectTitle} verification OTP`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verify Your Email</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
        <p style="color: #666; font-size: 13px;">This OTP is valid for 1 minute only.</p>
      </div>
    `,
  };
  return OtpMailer.sendMail(options);
};

class AuthService {
  // ==================== USER AUTH ====================

  async registerUser({ username, email, phone, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const otpCode = randomString.generate({ length: 4, charset: "numeric" });

    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      otp: { code: otpCode, generatedAt: Date.now() },
    });

    const savedUser = await user.save();
    try {
      await sendOtpMail(email, otpCode, "EventSphere User");
    } catch (mailErr) {
      console.error("OTP send error:", mailErr.message);
    }

    return { email: savedUser.email };
  }

  async verifyUserOtp({ email, otp }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const generatedAt = new Date(user.otp.generatedAt).getTime();
    if (Date.now() - generatedAt > 60 * 1000) {
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    if (otp !== user.otp.code) {
      throw new ApiError(400, "Invalid OTP code");
    }

    user.isVerified = true;
    user.otp.code = "";
    await user.save();

    return { message: "User registered successfully" };
  }

  async resendUserOtp({ email }) {
    if (!email) {
      throw new ApiError(400, "Email address is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newOtp = randomString.generate({ length: 4, charset: "numeric" });
    user.otp.code = newOtp;
    user.otp.generatedAt = Date.now();
    await user.save();

    await sendOtpMail(email, newOtp, "EventSphere User");
    return { email };
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found with this email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account blocked by administrator");
    }

    if (!user.isVerified) {
      await User.findOneAndDelete({ email });
      throw new ApiError(403, "Account not verified. Please register again.");
    }

    const token = jwt.sign(
      { id: user._id, user: { id: user._id, email: user.email, username: user.username } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;
    delete sanitizedUser.otp;

    return { token, user: sanitizedUser };
  }

  async verifyUserEmail({ email }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User with this email does not exist");
    }

    const newOtp = randomString.generate({ length: 4, charset: "numeric" });
    user.otp.code = newOtp;
    user.otp.generatedAt = Date.now();
    await user.save();

    await sendOtpMail(email, newOtp, "Password Reset");
    return { email };
  }

  async resetUserPassword({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User credentials missing or invalid");
    }

    user.password = await hashPassword(password);
    await user.save();
    return { message: "Password updated successfully" };
  }

  // ==================== EVENT ORGANIZER AUTH ====================

  async registerEvent(eventData) {
    const isEventExists = await Event.findOne({ email: eventData.email });
    if (isEventExists) {
      throw new ApiError(409, "Event organizer with this email already exists");
    }

    const hashedPassword = await hashPassword(eventData.password);
    const newOtp = randomString.generate({ length: 4, charset: "numeric" });

    const event = new Event({
      title: eventData.eventName,
      email: eventData.email,
      ownerName: eventData.Ownername,
      place: eventData.place,
      phone: eventData.phone,
      altPhone: eventData.altPhone,
      services: eventData.services,
      officeAddress: eventData.officeAddress,
      password: hashedPassword,
      otp: { code: newOtp, generatedAt: Date.now() },
    });

    const savedEvent = await event.save();
    try {
      await sendOtpMail(eventData.email, newOtp, "Event Organizer Verification");
    } catch (err) {
      console.error("Event OTP error:", err.message);
    }

    return { email: savedEvent.email };
  }

  async verifyEventOtp({ email, otp }) {
    const event = await Event.findOne({ email });
    if (!event) {
      throw new ApiError(404, "Event organizer not found");
    }

    const generatedAt = new Date(event.otp.generatedAt).getTime();
    if (Date.now() - generatedAt > 60 * 1000) {
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    if (otp !== event.otp.code) {
      throw new ApiError(400, "Invalid OTP code");
    }

    event.isVerified = true;
    event.otp.code = "";
    await event.save();

    return { message: "Event registered successfully" };
  }

  async resendEventOtp({ email }) {
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    const event = await Event.findOne({ email });
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const newOtp = randomString.generate({ length: 4, charset: "numeric" });
    event.otp.code = newOtp;
    event.otp.generatedAt = Date.now();
    await event.save();

    await sendOtpMail(email, newOtp, "Event Organizer Verification");
    return { email };
  }

  async loginEvent({ email, password }) {
    const event = await Event.findOne({ email });
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const isMatch = await bcrypt.compare(password, event.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (event.isBlocked) {
      throw new ApiError(403, "Event account is blocked by administrator");
    }

    if (!event.isVerified) {
      await Event.findOneAndDelete({ email });
      throw new ApiError(403, "Event account not verified. Please sign up again.");
    }

    const token = jwt.sign({ id: event._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sanitized = event.toObject();
    delete sanitized.password;
    delete sanitized.otp;

    return { token, event: sanitized };
  }

  async verifyEventEmail({ email }) {
    const event = await Event.findOne({ email });
    if (!event) {
      throw new ApiError(404, "Event account not found");
    }

    const newOtp = randomString.generate({ length: 4, charset: "numeric" });
    event.otp.code = newOtp;
    event.otp.generatedAt = Date.now();
    await event.save();

    await sendOtpMail(email, newOtp, "Event Password Reset");
    return { email };
  }

  async resetEventPassword({ email, password }) {
    const event = await Event.findOne({ email });
    if (!event) {
      throw new ApiError(404, "Event credentials missing or invalid");
    }

    event.password = await hashPassword(password);
    await event.save();
    return { message: "Event password updated successfully" };
  }

  // ==================== ADMIN AUTH ====================

  async loginAdmin({ email, password }) {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new ApiError(404, "Admin account not found");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new ApiError(401, "Incorrect admin password");
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const sanitized = admin.toObject();
    delete sanitized.password;

    return { token, admin: sanitized };
  }
}

module.exports = new AuthService();
