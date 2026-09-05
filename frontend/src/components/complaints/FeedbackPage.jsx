import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import api from "../../utils/API";
import { toast } from "react-toastify";
import Footer from "../../Layout/Footer/Footer.jsx";

const FeedbackPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("Suggestion");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/feedback/${complaintId}`, {
        rating,
        comment,
        category,
      });

      toast.success("Feedback submitted successfully ✅");
      navigate(-1); // go back to complaint page
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 mb-4 hover:text-blue-600 transition"
          >
            ← Back
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Rate your experience
              </h2>
              <p className="text-sm text-gray-500">
                Your feedback helps us improve
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div className="text-center space-y-2">
                <p className="text-xs font-medium text-gray-600">Tap to rate</p>
                <div className="flex justify-center">
                  <StarRating rating={rating} setRating={setRating} />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Feedback Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option>UI</option>
                  <option>Performance</option>
                  <option>Bug</option>
                  <option>Suggestion</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Write a review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                  placeholder="Describe your experience..."
                />
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center"
              >
                {loading ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>

          {/* Footer spacing */}
          <div className="mt-6 mb-2 text-center text-shadow-xs text-gray-400">
            Your feedback is anonymous and secure
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeedbackPage;
