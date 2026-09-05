import mongoose from "mongoose";
import argon2 from "argon2"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
      // Password only required if NOT a Google OAuth user
      return !this.googleId;
    }},
    googleId: { type: String, default: null },
    picture: { type: String, default: null },
    role: {
      type: String,
      enum: ["citizen", "officer", "admin"],
      default: "citizen",
    },
    isEmailValid: {
      type: Boolean,
      default: false, // ❗ Email verification ke liye
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    department: { type: String, default: "" }, // Only for officer
  },
  { timestamps: true }
);

// // Virtual field
// userSchema.virtual('confirmPassword')
//   .set(function(value) {
//     this._confirmPassword = value;
//   });

// userSchema.pre('save', function(next) {
//   if(this.password !== this._confirmPassword) {
//     throw new Error("Passwords do not match");
//   }
//   next();
// });

// userSchema.pre('save', async function() {
//   // Password hai hi nahi ya change nahi hua → skip karo
//   if (!this.password || !this.isModified('password')) return;
  
//   this.password = await argon2.hash(this.password);
 
// });

export const User = mongoose.model("User", userSchema);
