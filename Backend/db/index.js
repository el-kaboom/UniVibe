const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB using environment variable
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/SIH";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Handle again connection and errors
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String }, 
  otpExpiry: { type: Date },
});

// models
const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);

module.exports = {
  Admin,
  User,
};
