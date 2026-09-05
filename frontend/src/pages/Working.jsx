import Footer from "../Layout/Footer/Footer";

const steps = [
  {
    step: "01",
    title: "Citizen Raises Complaint",
    description:
      "A registered citizen logs in and submits a complaint with details such as category, description, and location.",
    color: "bg-blue-600",
  },
  {
    step: "02",
    title: "Admin Assigns Complaint",
    description:
      "The admin reviews incoming complaints and assigns them to the appropriate department officer.",
    color: "bg-green-600",
  },
  {
    step: "03",
    title: "Officer Investigates Issue",
    description:
      "The assigned officer investigates the complaint and updates the status regularly.",
    color: "bg-orange-500",
  },
  {
    step: "04",
    title: "Complaint Resolved",
    description:
      "Once resolved, the officer marks the complaint as resolved and the citizen is notified.",
    color: "bg-purple-600",
  },
];

const Working = () => {
  return (
    <>
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h2 className="text-6xl font-bold text-center text-[#1f3c88] mb-4">
            How PGRS Works
          </h2>
          <p className="text-center text-gray-600 mb-16">
            A transparent and structured grievance redressal workflow
          </p>

          <div>
            <img src="/baner-cpgrams_1.jpg" alt="" />
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                {/* Step Number */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-xl font-bold mb-4 ${item.color}`}
                >
                  {item.step}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Working;
