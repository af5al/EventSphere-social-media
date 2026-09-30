const authService = require("../../services/auth.service");
const eventService = require("../../services/event.service");
const jobService = require("../../services/job.service");
const CatchAsync = require("../../util/CatchAsync");

// ==================== AUTH ====================

exports.registerEvent = CatchAsync(async (req, res) => {
  const result = await authService.registerEvent(req.body);
  res.status(201).json({ success: "ok", email: result.email });
});

exports.verifyEventOtp = CatchAsync(async (req, res) => {
  const result = await authService.verifyEventOtp(req.body);
  res.status(200).json({ success: result.message });
});

exports.ResendOtpEvent = CatchAsync(async (req, res) => {
  const result = await authService.resendEventOtp(req.body);
  res.status(200).json({ success: "Otp Resended", email: result.email });
});

exports.verifyEventLogin = CatchAsync(async (req, res) => {
  const { token, event } = await authService.loginEvent(req.body);
  res.status(200).json({ success: "Login successful", token, event });
});

exports.verifyEvent = CatchAsync(async (req, res) => {
  const result = await authService.verifyEventEmail(req.body);
  res.status(200).json({ success: "ok", email: result.email });
});

exports.resetEventPassword = CatchAsync(async (req, res) => {
  const result = await authService.resetEventPassword(req.body);
  res.status(200).json({ success: result.message });
});

// ==================== PROFILE & POSTS ====================

exports.updateEvent = CatchAsync(async (req, res) => {
  const event = await eventService.updateEventDetails(req.eventId, req.body);
  res.status(200).json({ success: "event updated", event });
});

exports.updateEventProfile = CatchAsync(async (req, res) => {
  const event = await eventService.updateEventProfileImage(req.eventId, req.file?.filename);
  res.status(200).json({ success: "profile updated", event });
});

exports.getEventPosts = CatchAsync(async (req, res) => {
  const posts = await eventService.getEventPosts(req.eventId);
  res.status(200).json({ success: "ok", posts });
});

exports.getlikedUsers = CatchAsync(async (req, res) => {
  const users = await eventService.getLikedUsers(req.body.postId);
  res.status(200).json({ success: "ok", users });
});

exports.addPost = CatchAsync(async (req, res) => {
  const post = await eventService.addPost(req.eventId, req.body, req.file?.filename);
  res.status(201).json({ success: "ok", post });
});

exports.hasPlan = CatchAsync(async (req, res) => {
  const hasValidPlan = await eventService.hasPlan(req.eventId);
  res.status(200).json({ success: true, hasPlan: hasValidPlan });
});

exports.deletePost = CatchAsync(async (req, res) => {
  await eventService.deletePost(req.eventId, req.body.postId);
  res.status(200).json({ success: "post deleted" });
});

exports.addStory = CatchAsync(async (req, res) => {
  const story = await eventService.addStory(req.eventId, req.file?.filename);
  res.status(201).json({ success: "story added", story });
});

exports.getEventStory = CatchAsync(async (req, res) => {
  const stories = await eventService.getEventStory(req.eventId);
  res.status(200).json({ success: "ok", stories });
});

exports.getPostComments = CatchAsync(async (req, res) => {
  const comments = await eventService.getPostComments(req.body.postId);
  res.status(200).json({ success: true, comments });
});

exports.EventReply = CatchAsync(async (req, res) => {
  const { commentId, reply } = req.body;
  const updatedComment = await eventService.addEventReply({
    commentId,
    reply,
    eventId: req.eventId,
  });
  res.status(200).json({ success: true, newComment: updatedComment });
});

exports.deleteReply = CatchAsync(async (req, res) => {
  const { commentId, replyId } = req.body;
  const updatedComment = await eventService.deleteReply(commentId, replyId);
  res.status(200).json({ success: true, newComment: updatedComment });
});

// ==================== NOTIFICATIONS ====================

exports.getNotificationsCount = CatchAsync(async (req, res) => {
  const { count } = await eventService.getNotificationsCount(req.eventId);
  res.status(200).json({ success: true, count });
});

exports.getNotifications = CatchAsync(async (req, res) => {
  const notifications = await eventService.getNotifications(req.eventId);
  res.status(200).json({ success: true, notifications });
});

exports.clearNotification = CatchAsync(async (req, res) => {
  await eventService.clearNotification(req.body.NotId);
  res.status(200).json({ success: true });
});

exports.clearAllNotifications = CatchAsync(async (req, res) => {
  await eventService.clearAllNotifications(req.eventId);
  res.status(200).json({ success: "cleared All" });
});

exports.getFollowers = CatchAsync(async (req, res) => {
  const followers = await eventService.getFollowers(req.eventId);
  res.status(200).json({ success: true, followers });
});

// ==================== JOBS ====================

exports.addJobPost = CatchAsync(async (req, res) => {
  const post = await jobService.addJobPost(req.eventId, req.body);
  res.status(201).json({ success: "job added", post });
});

exports.getJobPosts = CatchAsync(async (req, res) => {
  const posts = await jobService.getJobPostsByEvent(req.eventId);
  res.status(200).json({ success: true, posts });
});

exports.editJobPost = CatchAsync(async (req, res) => {
  const updated = await jobService.editJobPost(req.body._id, req.body);
  res.status(200).json({ success: "job updated", post: updated });
});

exports.deleteJobPost = CatchAsync(async (req, res) => {
  await jobService.deleteJobPost(req.body.jobId);
  res.status(200).json({ success: "job deleted" });
});

exports.blockJobPost = CatchAsync(async (req, res) => {
  const job = await jobService.toggleBlockJobPost(req.body.jobId);
  res.status(200).json({ success: job.isBlocked ? "job blocked" : "job unblocked", job });
});

exports.userAppliedjobs = CatchAsync(async (req, res) => {
  const users = await jobService.getAppliedUsers(req.body.jobId);
  res.status(200).json({ success: true, users });
});

exports.acceptJobRequest = CatchAsync(async (req, res) => {
  const job = await jobService.acceptJobRequest(req.body.jobId, req.body.userId);
  res.status(200).json({ success: "accepted request", job });
});

exports.getEventJobStats = CatchAsync(async (req, res) => {
  const stats = await jobService.getEventJobStats(req.eventId, req.body.jobId);
  res.status(200).json({ success: true, stats });
});

exports.searchJob = CatchAsync(async (req, res) => {
  const results = await jobService.searchEventJobs(req.eventId, req.body.searched || "");
  res.status(200).json({ success: true, results });
});
