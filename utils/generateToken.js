const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userData) => {
  const { id, email, isAdmin } = userData;
  const tokenData = { id, email, isAdmin };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET,);
  return token;
};

module.exports = generateToken;
