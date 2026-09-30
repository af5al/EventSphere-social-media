const paypal = require("paypal-rest-sdk");
const Plan = require("../models/PlanModel");
const Event = require("../models/EventModel");
const PurchaseHistory = require("../models/PurchaseHistory");
const ApiError = require("../util/ApiError");

const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, BACKEND_URL } = process.env;

if (PAYPAL_CLIENT_ID && PAYPAL_SECRET_KEY) {
  paypal.configure({
    mode: PAYPAL_MODE || "sandbox",
    client_id: PAYPAL_CLIENT_ID,
    client_secret: PAYPAL_SECRET_KEY,
  });
}

class PaymentService {
  async getAvailablePlans(eventId) {
    const plans = await Plan.find({ isDeleted: false });
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    let currentPlan = null;
    if (event.selectedPlan && event.selectedPlan.transactionId) {
      currentPlan = await Plan.findById(event.selectedPlan.plan);
      if (currentPlan) {
        currentPlan = currentPlan.toObject();
        currentPlan.expiresOn = event.selectedPlan.expiry
          ? new Date(event.selectedPlan.expiry).toDateString()
          : null;
      }
    }

    return { plans, currentPlan };
  }

  async createPaypalPayment(eventId, planId) {
    const selectedPlan = await Plan.findById(planId);
    if (!selectedPlan) throw new ApiError(404, "Plan not found");

    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");

    const createPaymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${BACKEND_URL}/api/event/PaymentSuccess?planId=${selectedPlan._id}&eventId=${event._id}`,
        cancel_url: `${BACKEND_URL}/api/event/PaymentError`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: selectedPlan.name,
                sku: selectedPlan._id.toString(),
                price: selectedPlan.amount.toString(),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: selectedPlan.amount.toString(),
          },
          description: `Subscription to ${selectedPlan.name}`,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(createPaymentJson, (error, payment) => {
        if (error) {
          reject(new ApiError(500, "PayPal payment creation failed", [error.message]));
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return resolve({ approvalUrl: payment.links[i].href });
            }
          }
          reject(new ApiError(500, "Approval URL not returned by PayPal"));
        }
      });
    });
  }

  async executePaypalPayment(payerId, paymentId, planId, eventId) {
    const plan = await Plan.findById(planId);
    const event = await Event.findById(eventId);
    if (!plan || !event) throw new ApiError(404, "Plan or Event not found");

    const executePaymentJson = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: plan.amount.toString(),
          },
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
        if (error) {
          return reject(new ApiError(500, "PayPal execution failed", [error.message]));
        }

        try {
          const parsed = typeof payment === "string" ? JSON.parse(payment) : payment;
          const transactionId =
            parsed.transactions[0].related_resources[0].sale.id;
          const createdOn = new Date();
          const expiryDate = new Date(
            createdOn.getTime() + (plan.totalDays || 30) * 24 * 60 * 60 * 1000
          );

          event.selectedPlan = event.selectedPlan || {};
          event.selectedPlan.plan = plan._id;
          event.selectedPlan.transactionId = transactionId;
          event.selectedPlan.expiry = expiryDate;
          await event.save();

          await PurchaseHistory.create({
            plan: plan._id,
            event: eventId,
            transactionId,
            startDate: createdOn,
            expireDate: expiryDate,
          });

          resolve(true);
        } catch (dbErr) {
          reject(dbErr);
        }
      });
    });
  }
}

module.exports = new PaymentService();
