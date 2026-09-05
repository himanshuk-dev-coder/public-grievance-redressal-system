import {Feedback} from "./feedback.model.js";

export const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { complaintId } = req.params;
    console.log("USER :- ", req.user);

    const feedback = await Feedback.create({
      rating,
      comment,
      complaint: complaintId, // ✅ FIX
      user: req.user.id      // ✅ FIX (from auth middleware)
    });

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error("Add Feedback Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFeedbackByComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const feedbacks = await Feedback.find({
      complaint: complaintId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // only owner can update
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: "Feedback deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
          lowRatings: {
            $sum: {
              $cond: [{ $lte: ["$rating", 2] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        avgRating: 0,
        totalFeedback: 0,
        lowRatings: 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};