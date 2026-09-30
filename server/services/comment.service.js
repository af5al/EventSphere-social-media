const Comment = require("../models/CommentModel");
const EventPost = require("../models/EventPostModel");
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");
const ApiError = require("../util/ApiError");

class CommentService {
  async createComment({ postId, comment, userId, username }) {
    if (!postId) throw new ApiError(400, "Post ID is required");

    const createdComment = await Comment.create({
      postId,
      comment,
      userId,
    });

    const post = await EventPost.findById(postId);
    if (post) {
      post.commentsCount = (post.commentsCount || 0) + 1;
      await post.save();

      await Notification.create({
        recieverId: post.postedBy,
        senderId: userId,
        notificationMessage: `${username || "Someone"} commented "${comment}" on your post`,
        actionOn: {
          model: "eventPosts",
          objectId: postId,
        },
        date: new Date(),
      });
    }

    return createdComment;
  }

  async getAllComments(postId) {
    if (!postId) throw new ApiError(400, "Post ID is required");

    const comments = await Comment.find({ postId })
      .sort({ createdAt: "desc" })
      .populate("userId");

    return comments;
  }

  async deleteComment(commentId) {
    if (!commentId) throw new ApiError(400, "Comment ID is required");
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (comment.postId) {
      await EventPost.findByIdAndUpdate(comment.postId, {
        $inc: { commentsCount: -1 },
      });
    }

    await Comment.findByIdAndDelete(commentId);
    return true;
  }

  async addReply({ commentId, username, userId, reply }) {
    if (!commentId) throw new ApiError(400, "Comment ID is required");
    const user = await User.findById(userId);

    const replyObj = {
      commentId,
      username,
      repliedUser: { profile: user?.profile, id: user?._id },
      reply,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: replyObj } },
      { new: true }
    );

    if (!updatedComment) throw new ApiError(404, "Comment not found");
    return updatedComment;
  }

  async deleteReply(commentId, replyId) {
    if (!commentId || !replyId) throw new ApiError(400, "Comment ID and Reply ID are required");

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { replies: { _id: replyId } } },
      { new: true }
    );

    if (!updatedComment) throw new ApiError(404, "Comment not found");
    return updatedComment;
  }
}

module.exports = new CommentService();
