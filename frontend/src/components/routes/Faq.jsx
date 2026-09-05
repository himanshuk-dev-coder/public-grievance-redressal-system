import { useState } from "react";
import Footer from "../../Layout/Footer/Footer";

const faqs = [
  {
    question: "What is PGRS?",
    answer:
      "PGRS (Public Grievance Redressal System) is a platform that allows citizens to raise complaints related to public services and track their resolution transparently.",
  },
  {
    question: "Who can raise a complaint?",
    answer:
      "Any registered citizen can raise a complaint using the PGRS portal after logging in.",
  },
  {
    question: "How can I track my complaint?",
    answer:
      "After logging in, go to the Dashboard and click on 'My Complaints' to track the status of your submitted complaints.",
  },
  {
    question: "Who resolves the complaints?",
    answer:
      "Complaints are assigned to government officers by the admin. Officers investigate and update the complaint status.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. PGRS uses secure authentication and role-based access control to protect user data.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h2 className="text-4xl font-bold text-center text-[#1f3c88] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Find answers to the most common questions about PGRS
          </p>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-[#1f3c88]">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeIndex === index
                      ? "max-h-40 pb-5 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default FAQs;
