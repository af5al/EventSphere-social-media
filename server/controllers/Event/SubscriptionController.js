const paymentService = require("../../services/payment.service");
const CatchAsync = require("../../util/CatchAsync");

exports.availablePlans = CatchAsync(async (req, res) => {
  const { plans, currentPlan } = await paymentService.getAvailablePlans(req.eventId);
  res.status(200).json({ success: "ok", plans, currentPlan });
});

exports.buyPlan = CatchAsync(async (req, res) => {
  const result = await paymentService.createPaypalPayment(req.eventId, req.body.planId);
  res.status(200).json({ success: "payment is on", approvalUrl: result.approvalUrl });
});

exports.getSuccessPage = CatchAsync(async (req, res) => {
  const { PayerID, paymentId, planId, eventId } = req.query;
  await paymentService.executePaypalPayment(PayerID, paymentId, planId, eventId);
  return res.redirect(`${process.env.FRONTEND_URL}/PaymentSuccess`);
});

exports.getErrorPage = CatchAsync(async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/PaymentError`);
});
