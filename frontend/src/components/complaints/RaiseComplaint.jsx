import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../Layout/Footer/Footer.jsx";
import { submitComplaint } from "../../utils/complaintService.js";

const RaiseComplaint = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    // Images
    "image/jpeg",
    "image/png",
    "image/jpg",

    // PDF
    "application/pdf",

    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime", // mov
    "video/x-matroska", // mkv
  ];
  /* ===================== SUBMIT ===================== */
  const onSubmit = async (data) => {
    const toastId = toast.loading("Submitting complaint...");

    try {
      const formData = new FormData();

      formData.append("subject", data.subject);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("location", data.locationLink);

      if (data.attachment) {
        formData.append("attachment", data.attachment);
      }

      await submitComplaint(formData);

      toast.update(toastId, {
        render: "Complaint submitted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Failed to submit complaint",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  /* ===================== UI ===================== */
  return (
    <>
      <div className=" bg-linear-to-br from-blue-50 to-cyan-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-10">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Raise a Complaint
            </h2>
            <p className="text-gray-500 mt-2">
              Provide accurate details and share your live location
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Category */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Category</label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3 rounded-lg outline-none"
              >
                <option value="">Select Category</option>
                <option value="Corruption">Corruption</option>
                <option value="Delay in Service">Delay in Service</option>
                <option value="Misconduct">Misconduct</option>
                <option value="Criminal Matter">Criminal Matter</option>
                <option value="Service Request">Service Request</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Subject</label>
              <input
                {...register("subject", {
                  required: "Subject is required",
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3 rounded-lg outline-none"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                rows="4"
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3 rounded-lg outline-none resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Share Live Location */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">
                Share Live Location
              </label>
              <input
                type="url"
                placeholder="Paste Google Maps location link"
                {...register("locationLink", {
                  required: "Location link is required",
                  validate: (value) =>
                    value.includes("google") ||
                    "Enter a valid Google Maps link",
                })}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition px-4 py-3 rounded-lg outline-none"
              />
              {errors.locationLink && (
                <p className="text-red-500 text-sm">
                  {errors.locationLink.message}
                </p>
              )}
            </div>

            {/* Attachment Upload */}
            <Controller
              name="attachment"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <label className="font-medium text-gray-700">
                    Upload Attachment
                  </label>

                  <label
                    htmlFor="attachment"
                    className="relative flex flex-col items-center justify-center
                  h-48 w-full cursor-pointer
                  border-2 border-dashed border-blue-400
                  rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50
                  hover:scale-[1.02] transition-all duration-300"
                  >
                    <input
                      id="attachment"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov,.mkv,.webm"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        // ✅ 50MB limit for videos
                        if (file.size > MAX_FILE_SIZE) {
                          alert("File size must be less than 50MB");
                          return;
                        }

                        // ✅ Allow images + pdf + videos
                        if (!ALLOWED_TYPES.includes(file.type)) {
                          alert("Only Image, PDF or Video allowed");
                          return;
                        }

                        field.onChange(file);
                        setAttachmentPreview(file.name);
                      }}
                    />

                    <div className="text-5xl">📎</div>
                    <p className="mt-2 font-medium text-gray-700">
                      Click to Upload
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, PDF • Max 5MB
                    </p>
                  </label>

                  {attachmentPreview && (
                    <div
                      className="flex items-center justify-between
                    bg-green-50 border border-green-300
                    rounded-lg px-4 py-2 text-sm"
                    >
                      <span className="text-green-700 truncate">
                        ✔ {attachmentPreview}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(null);
                          setAttachmentPreview(null);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-blue-600 to-cyan-500
            hover:from-blue-700 hover:to-cyan-600
            text-white font-semibold py-3 rounded-xl
            shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RaiseComplaint;
