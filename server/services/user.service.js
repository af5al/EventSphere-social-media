const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const EventPost = require("../models/EventPostModel");
const Story = require("../models/StoryModel");
const Notification = require("../models/NotificationModel");
const Chats = require("../models/ChatsModel");
const ApiError = require("../util/ApiError");

class UserService {
  async getFollowingPosts(userId, page = 1, pageSize = 3) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.following || user.following.length === 0) {
      const posts = await EventPost.find({})
        .sort({ likes: -1, createdAt: -1 })
        .limit(pageSize)
        .populate("postedBy");
      return { posts, currentPage: page, totalPosts: posts.length };
    }

    const followingEventIds = user.following;
    const totalPosts = await EventPost.countDocuments({
      postedBy: { $in: followingEventIds },
    });

    const posts = await EventPost.find({ postedBy: { $in: followingEventIds } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1, likes: -1 })
      .populate("postedBy");

    return { posts, currentPage: page, totalPosts };
  }

  async getAllEventPosts(page = 1, pageSize = 3) {
    const totalPosts = await EventPost.countDocuments();
    const posts = await EventPost.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1, likes: -1 })
      .populate("postedBy");

    return { posts, currentPage: page, totalPosts };
  }

  async likePost(userId, postId) {
    const likedPost = await EventPost.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!likedPost) {
      throw new ApiError(404, "Post not found to like");
    }

    const user = await User.findById(userId);
    if (user) {
      await Notification.create({
        recieverId: likedPost.postedBy,
        senderId: user._id,
        notificationMessage: `${user.username} liked your post`,
        actionOn: {
          model: "eventPosts",
          objectId: likedPost._id,
        },
        date: new Date(),
      });
    }

    return likedPost;
  }

  async unlikePost(userId, postId) {
    const unlikedPost = await EventPost.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!unlikedPost) {
      throw new ApiError(404, "Post not found to unlike");
    }
    return unlikedPost;
  }

  async followEvent(userId, eventId) {
    if (!eventId) throw new ApiError(400, "Event ID is required");

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user || !event) throw new ApiError(404, "User or Event not found");

    if (!event.followers.includes(user._id)) {
      event.followers.push(user._id);
      await event.save();
    }
    if (!user.following.includes(event._id)) {
      user.following.push(event._id);
      await user.save();
    }

    await Notification.create({
      recieverId: eventId,
      senderId: user._id,
      notificationMessage: `${user.username} started following you`,
      actionOn: {
        model: "user",
        objectId: userId,
      },
      date: new Date(),
    });

    return { event, user };
  }

  async unfollowEvent(userId, eventId) {
    if (!eventId) throw new ApiError(400, "Event ID is required");

    const userUnfollowed = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: eventId } },
      { new: true }
    );
    const unfollowedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { followers: userId } },
      { new: true }
    );

    return { event: unfollowedEvent, user: userUnfollowed };
  }

  async getActiveStories() {
    const currentDate = new Date();
    await Story.deleteMany({ expiresOn: { $lt: currentDate } });

    const stories = await Story.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "events",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedByDetails",
        },
      },
      { $unwind: "$postedByDetails" },
      {
        $group: {
          _id: "$postedBy",
          stories: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          postedBy: "$_id",
          stories: 1,
        },
      },
    ]);

    return stories;
  }

  async getEventPostsInUser(eventId) {
    const posts = await EventPost.find({ postedBy: eventId }).sort({
      createdAt: -1,
    });
    return posts;
  }

  async getEventStoryInUser(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    const currentDate = new Date();
    await Story.deleteMany({ expiresOn: { $lt: currentDate } });

    const stories = await Story.find({ postedBy: event._id });
    return stories;
  }

  async editUserProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (profileData.username) user.username = profileData.username;
    if (profileData.phone) user.phone = profileData.phone;
    if (profileData.profile) user.profile = profileData.profile;

    await user.save();
    return user;
  }

  async saveJobProfile(userId, jobProfileData, cvFilename) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    user.jobProfile = user.jobProfile || {};
    user.jobProfile.fullName = jobProfileData.fullName;
    user.jobProfile.phone = jobProfileData.phone;
    user.jobProfile.skills = jobProfileData.skills;
    user.jobProfile.jobRole = jobProfileData.jobRole;
    user.jobProfile.yearOfExperience = jobProfileData.yearOfExperience;
    if (cvFilename) {
      user.jobProfile.CV = cvFilename;
    }
    user.isJobSeeker = true;

    await user.save();
    return user;
  }

  async getEventsList(page = 1, pageSize = 4) {
    const totalEvents = await Event.countDocuments({ isBlocked: false });
    const totalPages = Math.ceil(totalEvents / pageSize);

    const events = await Event.find({ isBlocked: false })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { events, currentPage: page, totalPages };
  }

  async getUserNotificationsCount(userId) {
    const count = await Notification.countDocuments({
      recieverId: userId,
      seen: false,
    });
    const MsgCount = await Chats.countDocuments({
      userId,
      isUserSeen: false,
    });
    return { count, MsgCount };
  }

  async getUserNotifications(userId) {
    await Notification.updateMany(
      { recieverId: userId, seen: false },
      { $set: { seen: true } }
    );

    const notifications = await Notification.find({
      recieverId: userId,
      seen: true,
    }).sort({ date: -1 });

    for (const notification of notifications) {
      if (notification?.actionOn?.objectId && notification?.actionOn?.model) {
        await notification.populate({
          path: "actionOn.objectId",
          model: notification.actionOn.model,
        });
      }
    }

    return notifications;
  }

  async clearUserNotification(notificationId) {
    await Notification.findByIdAndDelete(notificationId);
    return true;
  }

  async clearAllUserNotifications(userId) {
    await Notification.deleteMany({ recieverId: userId, seen: true });
    return true;
  }

  async getFollowings(userId) {
    const user = await User.findById(userId).populate("following");
    if (!user) throw new ApiError(404, "User not found");
    return user.following || [];
  }
}

module.exports = new UserService();
