const jwt = require("jsonwebtoken");

// Verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This should include both id and username
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Verify token and check if user is admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action!" });
    }
  });
};

// Verify token and check if user is authorized (same user or admin)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action!" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
