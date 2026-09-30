require("dotenv").config();
const jwt = require("jsonwebtoken");
const Event = require("../models/EventModel");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
        error: "Auth failed",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      token = token.slice(1, -1);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          error: "Auth failed",
        });
      }

      req.eventId = decoded.id;

      // Check and clear expired plan of event
      try {
        const event = await Event.findById(req.eventId);
        const currentDate = new Date();
        if (event?.selectedPlan?.transactionId) {
          if (event?.selectedPlan?.expiry < currentDate) {
            await Event.updateOne(
              { _id: req.eventId },
              { $unset: { selectedPlan: 1 } }
            );
          }
        }
      } catch (dbErr) {
        console.error("Plan expiry check error:", dbErr.message);
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
      error: error.message,
    });
  }
};
