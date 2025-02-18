const jwt = require("jsonwebtoken");
require('dotenv').config();

// Middleware for handling auth
async function  authUsingPass(req, res, next) {
           try {
          // Validate the request body with Zod
          const { username, password } = adminSchema.parse(req.body);
      
          const user = await User.findOne({ username, password });
          if (!user) {
            return res.status(401).json({
              message: "Incorrect username or password",
            });
          }
      
          // Create JWT token
          const token = jwt.sign({ username }, process.env.JWT_SECRET);
      
          // Respond with token
          return res.json({ token });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({
              errors: error.errors,
            });
          }
          return res.status(500).json({
            message: "Internal server error",
          });
        }
}
module.exports = authUsingPass;