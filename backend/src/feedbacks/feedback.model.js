import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      enum: ["UI", "Performance", "Bug", "Suggestion", "Other"],
      default: "Other",
    },

    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    likes: {
      type: Number,
      default: 0,
    },

    // optional: track users who liked (avoid duplicate likes)
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // optional: admin flag for negative feedback
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },  // createdAt, updatedAt auto
);

// feedbackSchema.pre("save", function (next) {
//   if (this.rating < 3) {
//     this.isFlagged = true;
//   }
//   next();
// });

export const Feedback = mongoose.model("Feedback", feedbackSchema);

