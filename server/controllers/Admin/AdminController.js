const authService = require("../../services/auth.service");
const adminService = require("../../services/admin.service");
const CatchAsync = require("../../util/CatchAsync");

exports.verifyAdminLogin = CatchAsync(async (req, res) => {
  const { token, admin } = await authService.loginAdmin(req.body);
  res.status(200).json({ success: "Login successfull", token, admin });
});

exports.getUsers = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const result = await adminService.getUsers(page, 3);
  res.status(200).json({
    success: "ok",
    users: result.users,
    currentPage: result.currentPage,
    totalPages: result.totalPages,
  });
});

exports.blockUser = CatchAsync(async (req, res) => {
  const user = await adminService.toggleBlockUser(req.body.id);
  res.status(200).json({
    success: user.isBlocked ? `${user.username} is blocked` : `${user.username} is unblocked`,
  });
});

exports.getPlans = CatchAsync(async (req, res) => {
  const plans = await adminService.getPlans();
  res.status(200).json({ success: "ok", plans });
});

exports.blockPlan = CatchAsync(async (req, res) => {
  const plan = await adminService.toggleBlockPlan(req.body.id);
  res.status(200).json({
    success: plan.isDeleted ? `${plan.name} is blocked` : `${plan.name} is unblocked`,
  });
});

exports.addPlan = CatchAsync(async (req, res) => {
  const plan = await adminService.addPlan(req.body);
  res.status(201).json({ success: "plan added", plan });
});

exports.editPlan = CatchAsync(async (req, res) => {
  const plan = await adminService.editPlan(req.body.id, req.body);
  res.status(200).json({ success: "plan updated", plan });
});

exports.getEvents = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const result = await adminService.getEvents(page, 3);
  res.status(200).json({
    success: "ok",
    events: result.events,
    currentPage: result.currentPage,
    totalPages: result.totalPages,
  });
});

exports.blockEvent = CatchAsync(async (req, res) => {
  const event = await adminService.toggleBlockEvent(req.body.id);
  res.status(200).json({
    success: event.isBlocked ? `${event.title} is blocked` : `${event.title} is unblocked`,
  });
});

exports.getSubscriptionHistory = CatchAsync(async (req, res) => {
  const history = await adminService.getSubscriptionHistory();
  res.status(200).json({ success: "ok", history });
});

exports.getBanners = CatchAsync(async (req, res) => {
  const banners = await adminService.getBanners();
  res.status(200).json({ success: "ok", banners });
});

exports.getClientBanners = CatchAsync(async (req, res) => {
  const banners = await adminService.getClientBanners();
  res.status(200).json({ success: "ok", banners });
});

exports.addBanner = CatchAsync(async (req, res) => {
  const banner = await adminService.addBanner(req.body, req.file?.filename);
  res.status(201).json({ success: "banner added", banner });
});

exports.updateBanner = CatchAsync(async (req, res) => {
  const banner = await adminService.updateBanner(req.body, req.file?.filename);
  res.status(200).json({ success: "banner updated", banner });
});

exports.blockBanner = CatchAsync(async (req, res) => {
  const banner = await adminService.toggleBlockBanner(req.body.id);
  res.status(200).json({
    success: banner.isBlocked ? `${banner.title} is blocked` : `${banner.title} is unblocked`,
  });
});

exports.getDashboardDetails = CatchAsync(async (req, res) => {
  const stats = await adminService.getDashboardDetails();
  res.status(200).json({ success: "ok", ...stats });
});
