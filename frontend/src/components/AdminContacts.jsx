import { useEffect, useState } from "react";
import api from "../utils/API.js";
import Footer from "../Layout/Footer/Footer.jsx";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Contacts
  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ Update Status
  const markResponded = async (id) => {
    try {
      await api.put(`/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  // ✅ Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-semibold animate-pulse">
          Loading Contact Messages...
        </p>
      </div>
    );

  return (
    <>
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Contact Messages
        </h1>
        <p className="text-gray-500">
          Manage and respond to citizen queries
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {contact.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {contact.email}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {contact.subject}
                    </td>

                    <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                      {contact.message}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          contact.status === "Pending"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-6 py-4 text-center">
                      {contact.status === "Pending" ? (
                        <button
                          onClick={() =>
                            markResponded(contact._id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs transition duration-200 shadow-sm"
                        >
                          Mark Responded
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium text-xs">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AdminContact;