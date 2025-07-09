const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  createdOn: { type: Date, default: new Date().getTime() },
  googleId: { type: String }, // google authentication ID
  isVerified: { type: Boolean, default: false }, // email verification status
  verificationToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);
