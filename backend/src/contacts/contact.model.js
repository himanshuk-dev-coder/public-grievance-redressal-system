import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Responded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);