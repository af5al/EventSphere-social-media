const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const Plan = require("../models/PlanModel");
const Banner = require("../models/BannerModel");
const PurchaseHistory = require("../models/PurchaseHistory");
const ApiError = require("../util/ApiError");

class AdminService {
  async getUsers(page = 1, pageSize = 3) {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / pageSize);

    const users = await User.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { users, currentPage: page, totalPages };
  }

  async toggleBlockUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  }

  async getPlans() {
    return await Plan.find({});
  }

  async toggleBlockPlan(planId) {
    const plan = await Plan.findById(planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    plan.isDeleted = !plan.isDeleted;
    await plan.save();
    return plan;
  }

  async addPlan({ name, amount, description, duration }) {
    const totalDays = duration === "monthly" ? 30 : 365;
    const plan = new Plan({
      name,
      amount,
      description,
      duration,
      totalDays,
    });
    return await plan.save();
  }

  async editPlan(id, { name, amount, description, duration }) {
    const totalDays = duration === "monthly" ? 30 : 365;
    const plan = await Plan.findById(id);
    if (!plan) throw new ApiError(404, "Plan not found");

    plan.name = name;
    plan.amount = amount;
    plan.description = description;
    plan.duration = duration;
    plan.totalDays = totalDays;

    return await plan.save();
  }

  async getEvents(page = 1, pageSize = 3) {
    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / pageSize);

    const events = await Event.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { events, currentPage: page, totalPages };
  }

  async toggleBlockEvent(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    event.isBlocked = !event.isBlocked;
    await event.save();
    return event;
  }

  async getSubscriptionHistory() {
    return await PurchaseHistory.find({})
      .populate("plan")
      .populate("event")
      .sort({ startDate: -1 });
  }

  async getBanners() {
    return await Banner.find({});
  }

  async getClientBanners() {
    return await Banner.find({ isBlocked: false });
  }

  async addBanner({ title, description }, imageFilename) {
    const banner = new Banner({
      title,
      description,
      image: imageFilename,
    });
    return await banner.save();
  }

  async updateBanner({ id, title, description }, imageFilename) {
    const banner = await Banner.findById(id);
    if (!banner) throw new ApiError(404, "Banner not found");

    banner.title = title;
    banner.description = description;
    if (imageFilename) banner.image = imageFilename;

    return await banner.save();
  }

  async toggleBlockBanner(bannerId) {
    const banner = await Banner.findById(bannerId);
    if (!banner) throw new ApiError(404, "Banner not found");

    banner.isBlocked = !banner.isBlocked;
    await banner.save();
    return banner;
  }

  async getDashboardDetails() {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const subscriptions = await PurchaseHistory.find({}).populate("plan");

    const totalRevenue = subscriptions.reduce(
      (acc, curr) => acc + (curr.plan?.amount || 0),
      0
    );

    return {
      totalUsers,
      totalEvents,
      totalSubscriptions: subscriptions.length,
      totalRevenue,
    };
  }
}

module.exports = new AdminService();
