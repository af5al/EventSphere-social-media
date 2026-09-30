const authService = require("../../services/auth.service");
const userService = require("../../services/user.service");
const jobService = require("../../services/job.service");
const CatchAsync = require("../../util/CatchAsync");

// ==================== AUTHENTICATION ====================

exports.register = CatchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({ success: "ok", email: result.email });
});

exports.loginUser = CatchAsync(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);
  res.status(200).json({ success: "Login successful", token, user });
});

exports.VerifyOtp = CatchAsync(async (req, res) => {
  const result = await authService.verifyUserOtp(req.body);
  res.status(200).json({ success: result.message });
});

exports.ResendOtp = CatchAsync(async (req, res) => {
  const result = await authService.resendUserOtp(req.body);
  res.status(200).json({ success: "Otp Resended", email: result.email });
});

exports.verifyEmail = CatchAsync(async (req, res) => {
  const result = await authService.verifyUserEmail(req.body);
  res.status(200).json({ success: "ok", email: result.email });
});

exports.resetPassword = CatchAsync(async (req, res) => {
  const result = await authService.resetUserPassword(req.body);
  res.status(200).json({ success: result.message });
});

// ==================== FEED & POSTS ====================

exports.getFollowingposts = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const result = await userService.getFollowingPosts(req.userId, page, 3);
  res.status(200).json({
    success: "ok",
    posts: result.posts,
    currentPage: result.currentPage,
    totalPosts: result.totalPosts,
  });
});

exports.getEventPosts = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const result = await userService.getAllEventPosts(page, 3);
  res.status(200).json({
    success: "ok",
    posts: result.posts,
    currentPage: result.currentPage,
    totalPosts: result.totalPosts,
  });
});

exports.likePost = CatchAsync(async (req, res) => {
  const post = await userService.likePost(req.userId, req.body.postId);
  res.status(200).json({ success: "ok", post });
});

exports.UnlikePost = CatchAsync(async (req, res) => {
  const post = await userService.unlikePost(req.userId, req.body.postId);
  res.status(200).json({ success: "ok", post });
});

exports.followEvent = CatchAsync(async (req, res) => {
  const { event, user } = await userService.followEvent(req.userId, req.body.eventId);
  res.status(200).json({ success: "ok", event, user });
});

exports.unfollowEvent = CatchAsync(async (req, res) => {
  const { event, user } = await userService.unfollowEvent(req.userId, req.body.eventId);
  res.status(200).json({ success: "ok", event, user });
});

exports.getStories = CatchAsync(async (req, res) => {
  const stories = await userService.getActiveStories();
  res.status(200).json({ success: "ok", stories });
});

exports.getEventPostsinUser = CatchAsync(async (req, res) => {
  const posts = await userService.getEventPostsInUser(req.body.eventId);
  res.status(200).json({ success: "ok", posts });
});

exports.getEventStoryinUser = CatchAsync(async (req, res) => {
  const stories = await userService.getEventStoryInUser(req.body.eventId);
  res.status(200).json({ success: "ok", stories });
});

// ==================== PROFILE ====================

exports.editUser = CatchAsync(async (req, res) => {
  const user = await userService.editUserProfile(req.userId, req.body);
  res.status(200).json({ success: "profile updated", user });
});

exports.addJobProfile = CatchAsync(async (req, res) => {
  const user = await userService.saveJobProfile(req.userId, req.body, req.file?.filename);
  res.status(200).json({ success: "job profile added", user });
});

exports.updateJobProfile = CatchAsync(async (req, res) => {
  const user = await userService.saveJobProfile(req.userId, req.body, req.file?.filename);
  res.status(200).json({ success: "job profile added", user });
});

exports.getEvents = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const result = await userService.getEventsList(page, 4);
  res.status(200).json({
    success: "ok",
    events: result.events,
    currentPage: result.currentPage,
    totalPages: result.totalPages,
  });
});

exports.getFollowings = CatchAsync(async (req, res) => {
  const followings = await userService.getFollowings(req.userId);
  res.status(200).json({ success: true, followings });
});

// ==================== NOTIFICATIONS ====================

exports.getUserNotificationsCount = CatchAsync(async (req, res) => {
  const { count, MsgCount } = await userService.getUserNotificationsCount(req.userId);
  res.status(200).json({ success: true, count, MsgCount });
});

exports.getUserNotifications = CatchAsync(async (req, res) => {
  const notifications = await userService.getUserNotifications(req.userId);
  res.status(200).json({ success: true, notifications });
});

exports.clearUserNotification = CatchAsync(async (req, res) => {
  await userService.clearUserNotification(req.body.NotId);
  res.status(200).json({ success: true });
});

exports.clearAllUserNotifications = CatchAsync(async (req, res) => {
  await userService.clearAllUserNotifications(req.userId);
  res.status(200).json({ success: "cleared All" });
});

// ==================== JOBS ====================

exports.getJobs = CatchAsync(async (req, res) => {
  const posts = await jobService.getJobsForUser(req.userId);
  res.status(200).json({ success: true, posts });
});

exports.applyJob = CatchAsync(async (req, res) => {
  await jobService.applyJob(req.userId, req.body.jobId);
  res.status(200).json({ success: "applied" });
});

exports.getJobStats = CatchAsync(async (req, res) => {
  const stats = await jobService.getUserJobStats(req.userId);
  res.status(200).json({ success: true, stats });
});

exports.UserSearchJob = CatchAsync(async (req, res) => {
  const results = await jobService.searchJobsForUser(req.userId, req.body.searched || "");
  res.status(200).json({ success: true, results });
});
