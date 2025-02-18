const { Router } = require("express");
//const adminMiddleware = require("../middleware/admin");
const { Admin, User } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const z = require("zod");


const router = Router();

//Admin Routes
const adminSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

router.post("/signin", async (req, res) => {

  const token = req.headers.authorization; // bearer token
  const words = token.split(" "); // ["Bearer", "token"]
  const jwtToken = words[1]; // token
  if(jwtToken){
    try{
      const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);
      if (decodedValue.username) {
          next();
      } else {
          res.status(403).json({
              msg: "You are not authenticated"
          })
      }
  }catch (error) {
    // If the token is invalid or expired
    if (error.name !== "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    }  
  }
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
});
module.exports = router;
