import { useEffect, useState } from "react";
import api from "../utils/API.js";
import Footer from "../Layout/Footer/Footer.jsx";
import { ChevronDown, Building2 } from "lucide-react";

// Static mapping of ministries → departments
const ministryDepartments = {
  "Ministry of Home Affairs": [
    "Police",
    "Fire Services",
    "Disaster Management",
  ],
  "Ministry of Health & Family Welfare": [
    "Hospitals",
    "Public Health",
    "Drug Control",
  ],
  "Ministry of Education": [
    "Schools",
    "Colleges & Universities",
    "Skill Development",
  ],
  "Ministry of Transport": [
    "Road Transport",
    "Railways",
    "Traffic & Licensing",
  ],
  "Ministry of Environment, Forest & Climate Change": [
    "Pollution Control",
    "Wildlife",
    "Forest Management",
  ],
  "Ministry of Urban Development": [
    "Water Supply",
    "Electricity",
    "Public Works / Infrastructure",
  ],
};

const MinistryDepartments = () => {
  const [ministries, setMinistries] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMinistries = async () => {
    try {
      const res = await api.get("/ministries"); // backend route
      console.log(res.data.data);
      setMinistries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading ministries...</p>;
  }

  return (
    <>
      <div className="p-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ministries & Departments
        </h2>

        <div className="space-y-4">
          {ministries.map((ministry) => {
            const departments =
              ministryDepartments[ministry.ministryName] || [];

            return (
              <div
                key={ministry._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <button
                  onClick={() =>
                    setExpanded(expanded === ministry._id ? null : ministry._id)
                  }
                  className="w-full flex justify-between items-center p-5"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {ministry.ministryName}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`transition ${
                      expanded === ministry._id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded === ministry._id && (
                  <div className="border-t px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50">
                    {departments.map((dept, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 bg-white rounded-lg border text-gray-700 hover:bg-blue-50"
                      >
                        {dept}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MinistryDepartments;
