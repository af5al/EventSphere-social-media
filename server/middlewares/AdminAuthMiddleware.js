require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No admin authorization token provided",
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

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired admin token",
          error: "Auth failed",
        });
      }
      req.adminId = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during admin authentication",
      error: error.message,
    });
  }
};
