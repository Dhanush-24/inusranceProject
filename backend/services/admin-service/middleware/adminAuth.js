const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.header("Authorization");

  // If no header or invalid format, respond with 401
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Extract token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user (admin) to the request object
    req.admin = decoded;

    // Move to the next middleware/route handler
    next();
  } catch (error) {
    // Handle token errors (invalid/expired tokens)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(400).json({ message: "Invalid token." });
  }
};
