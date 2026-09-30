const Event = require("../models/EventModel");
const EventPost = require("../models/EventPostModel");
const Story = require("../models/StoryModel");
const Comment = require("../models/CommentModel");
const Notification = require("../models/NotificationModel");
const ApiError = require("../util/ApiError");

class EventService {
  async updateEventDetails(eventId, data) {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    if (data.title) event.title = data.title;
    if (data.ownerName) event.ownerName = data.ownerName;
    if (data.place) event.place = data.place;
    if (data.phone) event.phone = data.phone;
    if (data.altPhone) event.altPhone = data.altPhone;
    if (data.officeAddress) event.officeAddress = data.officeAddress;
    if (data.services) event.services = data.services;

    await event.save();
    return event;
  }

  async updateEventProfileImage(eventId, profileImageFilename) {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    event.profile = profileImageFilename;
    await event.save();
    return event;
  }

  async getEventPosts(eventId) {
    return await EventPost.find({ postedBy: eventId }).sort({ createdAt: -1 });
  }

  async getLikedUsers(postId) {
    const post = await EventPost.findById(postId).populate("likes");
    if (!post) throw new ApiError(404, "Post not found");
    return post.likes;
  }

  async addPost(eventId, postData, imageFilename) {
    const post = new EventPost({
      postedBy: eventId,
      image: imageFilename,
      caption: postData.caption,
      location: postData.location,
    });
    return await post.save();
  }

  async hasPlan(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");
    return !!event?.selectedPlan?.transactionId;
  }

  async deletePost(eventId, postId) {
    const post = await EventPost.findOne({ _id: postId, postedBy: eventId });
    if (!post) throw new ApiError(404, "Post not found or unauthorized to delete");

    await Comment.deleteMany({ postId });
    await EventPost.findByIdAndDelete(postId);
    return true;
  }

  async addStory(eventId, imageFilename) {
    const currentDate = new Date();
    const expiresOn = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

    const story = new Story({
      postedBy: eventId,
      image: imageFilename,
      expiresOn,
    });
    return await story.save();
  }

  async getEventStory(eventId) {
    const currentDate = new Date();
    await Story.deleteMany({ expiresOn: { $lt: currentDate } });
    return await Story.find({ postedBy: eventId });
  }

  async getPostComments(postId) {
    return await Comment.find({ postId }).populate("userId");
  }

  async addEventReply({ commentId, reply, eventId }) {
    const event = await Event.findById(eventId);
    const replyObj = {
      commentId,
      username: event?.title || "Organizer",
      repliedUser: { profile: event?.profile, id: event?._id },
      reply,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: replyObj } },
      { new: true }
    );
    return updatedComment;
  }

  async deleteReply(commentId, replyId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );
  }

  async getNotifications(eventId) {
    await Notification.updateMany(
      { recieverId: eventId, seen: false },
      { $set: { seen: true } }
    );

    const notifications = await Notification.find({
      recieverId: eventId,
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

  async clearNotification(notificationId) {
    await Notification.findByIdAndDelete(notificationId);
    return true;
  }

  async clearAllNotifications(eventId) {
    await Notification.deleteMany({ recieverId: eventId, seen: true });
    return true;
  }

  async getNotificationsCount(eventId) {
    const count = await Notification.countDocuments({
      recieverId: eventId,
      seen: false,
    });
    return { count };
  }

  async getFollowers(eventId) {
    const event = await Event.findById(eventId).populate("followers");
    if (!event) throw new ApiError(404, "Event not found");
    return event.followers || [];
  }
}

module.exports = new EventService();
