import { useState } from "react";
import api from "../../utils/API.js"; // axios instance
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Footer from "../../Layout/Footer/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/contacts", formData);
      console.log(res.data);
      if (res.data.success) {
        toast.success("Message sent successfully ✅");

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("BACKEND MESSAGE:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 px-6 py-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-700">Contact Us</h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Have questions or facing issues? Reach out to the Public Grievance
            Redressal System support team. We are here to assist you.
          </p>
        </motion.div>

        {/* CONTACT GRID */}
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Write your message..."
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-6 flex gap-4 items-start hover:shadow-xl transition"
              >
                <info.icon className="text-blue-600" size={28} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{info.details}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* MAP SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-6xl mx-auto mt-14"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <iframe
              title="location"
              src="https://maps.google.com/maps?q=New%20Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-[350px] border-0"
              loading="lazy"
            ></iframe>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

/* CONTACT INFO DATA */
const contactInfo = [
  {
    icon: Phone,
    title: "Helpline Number",
    details: "+91 1800-123-4567",
  },
  {
    icon: Mail,
    title: "Email Support",
    details: "support@pgrs.gov.in",
  },
  {
    icon: MapPin,
    title: "Office Address",
    details: "Department of Public Services, New Delhi, India",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: "Monday – Friday | 9:00 AM – 6:00 PM",
  },
];

export default Contact;
