import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  MessageSquareWarning,
} from "lucide-react";
import Footer from "../../Layout/Footer/Footer";

const About = () => {
  return (
    <>
      <div className="bg-gray-50 px-6 py-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-700">
            Public Grievance Redressal System
          </h1>
          <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
            A digital platform designed to bridge the gap between citizens and
            authorities by enabling transparent, efficient, and accountable
            grievance resolution.
          </p>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-blue-600"
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">
              🎯 Our Mission
            </h2>
            <p className="text-gray-600">
              To empower citizens by providing a transparent and
              technology-driven grievance redressal platform that ensures faster
              complaint handling, accountability, and improved governance.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-green-600"
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              🌍 Our Vision
            </h2>
            <p className="text-gray-600">
              To build a smart governance ecosystem where every citizen's voice
              is heard and every grievance is resolved efficiently using digital
              innovation.
            </p>
          </motion.div>
        </div>

        {/* KEY FEATURES */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Key Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-md p-6 text-center"
              >
                <feature.icon
                  size={40}
                  className="mx-auto text-blue-600 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WORKFLOW SECTION */}
        <div className="bg-blue-700 text-white rounded-2xl p-10 mb-14 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {workflow.map((step, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{step.step}</div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-blue-100 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IMPACT SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center bg-white rounded-2xl shadow-lg p-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            The Public Grievance Redressal System enhances transparency,
            improves administrative efficiency, reduces complaint resolution
            time, and strengthens trust between citizens and government
            authorities.
          </p>
        </motion.div>
      </div>
      <Footer/>
    </>
  );
};

/* FEATURES DATA */
const features = [
  {
    icon: MessageSquareWarning,
    title: "Easy Complaint Registration",
    desc: "Citizens can quickly submit grievances with images and detailed descriptions.",
  },
  {
    icon: ClipboardList,
    title: "Real-Time Tracking",
    desc: "Track complaint status and updates in real time.",
  },
  {
    icon: Users,
    title: "Officer Assignment",
    desc: "Automatic allocation of complaints to responsible officers.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Visual dashboards for Admin, Officers, and Citizens.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent System",
    desc: "Ensures accountability and transparent grievance resolution.",
  },
];

/* WORKFLOW DATA */
const workflow = [
  {
    step: "01",
    title: "Submit Complaint",
    desc: "Citizen registers grievance online.",
  },
  {
    step: "02",
    title: "Assign Officer",
    desc: "System assigns complaint automatically.",
  },
  {
    step: "03",
    title: "Processing",
    desc: "Officer reviews and resolves the issue.",
  },
  {
    step: "04",
    title: "Resolution",
    desc: "Citizen receives resolution update.",
  },
];

export default About;
