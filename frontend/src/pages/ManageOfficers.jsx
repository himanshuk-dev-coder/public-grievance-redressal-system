import { useEffect, useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import api from "../utils/API";
import { toast } from "react-toastify";
import Footer from "../Layout/Footer/Footer";
import "../components/complaints/AdminComplaints.css"

const ManageOfficers = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState("");
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- CREATE OFFICER STATE ---------- */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    email: "",
    password: "",
    ministry: "",
    department: "",
  });

  /* ================= FETCH MINISTRIES ================= */
  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const res = await api.get("/ministries");
        console.log(res.data.data);
        setMinistries(res.data.data || []);
      } catch {
        toast.error("Failed to load ministries");
      }
    };

    fetchMinistries();
  }, []);

  /* ================= FETCH OFFICERS ================= */
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get("/admin/officers");
        setOfficers(res.data.data || []);
      } catch {
        toast.error("Failed to load officers");
      }
    };

    fetchOfficers();
  }, []);

  /* ================= FETCH DEPARTMENTS ================= */
  const fetchDepartments = async (ministry) => {
    if (!ministry) {
      setDepartments([]);
      return;
    }

    try {
      const res = await api.get(`/ministries/${ministry}`);
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load departments");
      setDepartments([]);
    }
  };

  /* ================= HANDLERS ================= */
  const handleMinistryChange = (e) => {
    const ministryName = e.target.value;
    setSelectedMinistry(ministryName);
    fetchDepartments(ministryName);
  };

  const handleDepartmentChange = (officerId, department) => {
    setOfficers((prev) =>
      prev.map((officer) =>
        officer._id === officerId ? { ...officer, department } : officer,
      ),
    );
  };

  const saveDepartment = async (officerId, department) => {
    if (!department) {
      toast.warning("Please select a department");
      return;
    }

    try {
      setLoading(true);
      await api.patch(`/admin/officers/${officerId}`, { department });
      toast.success("Department updated successfully");
    } catch {
      toast.error("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  const deleteOfficer = async (id) => {
    if (!window.confirm("Delete this officer?")) return;

    try {
      await api.delete(`/admin/officers/${id}`);
      setOfficers((prev) => prev.filter((o) => o._id !== id));
      toast.success("Officer deleted");
    } catch {
      toast.error("Failed to delete officer");
    }
  };

  /* ================= CREATE OFFICER ================= */
  const handleCreateOfficer = async () => {
    const { name, email, password, ministry, department } = newOfficer;

    if (!name || !email || !password || !ministry || !department) {
      toast.warning("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/create-officer", newOfficer);

      toast.success("Officer created successfully");
      setShowCreateModal(false);
      setNewOfficer({
        name: "",
        email: "",
        password: "",
        ministry: "",
        department: "",
      });

      fetchOfficers(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Officer Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="create-btn"
          >
            <Plus size={18} /> Create Officer
          </button>
        </div>

        {/* Ministry Selector */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Ministry</label>
          <select
            value={selectedMinistry}
            onChange={handleMinistryChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Ministry</option>
            {ministries.map((ministry) => (
              <option key={ministry.ministryName} value={ministry.ministryName}>
                {ministry.ministryName}
              </option>
            ))}
          </select>
        </div>

        {/* Officers Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Officer</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {officers.map((officer) => (
                <tr key={officer._id} className="border-t">
                  <td className="p-3">
                    <div className="font-semibold">{officer.name}</div>
                    <div className="text-sm text-gray-500">{officer.email}</div>
                  </td>

                  {/* Department Dropdown */}
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                      <select
                        value={officer.department || ""}
                        disabled={!departments.length}
                        onChange={(e) =>
                          handleDepartmentChange(officer._id, e.target.value)
                        }
                        className="p-2 border rounded"
                      >
                        <option value="">
                          {departments.length
                            ? "Select Department"
                            : "Select Ministry First"}
                        </option>

                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          saveDepartment(officer._id, officer.department)
                        }
                        disabled={loading}
                        className="save-btn"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      ACTIVE
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteOfficer(officer._id)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {!officers.length && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No officers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* ================= CREATE OFFICER MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Create Officer</h2>
              <X onClick={() => setShowCreateModal(false)} />
            </div>

            {["name", "email", "password"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field.toUpperCase()}
                className="w-full mb-3 p-2 border rounded"
                value={newOfficer[field]}
                onChange={(e) =>
                  setNewOfficer({ ...newOfficer, [field]: e.target.value })
                }
              />
            ))}

            <select
              className="w-full mb-3 p-2 border rounded"
              value={newOfficer.ministry}
              onChange={(e) => {
                setNewOfficer({
                  ...newOfficer,
                  ministry: e.target.value,
                  department: "",
                });
                fetchDepartments(e.target.value);
              }}
            >
              <option value="">Select Ministry</option>
              {ministries.map((m) => (
                <option key={m.ministryName} value={m.ministryName}>
                  {m.ministryName}
                </option>
              ))}
            </select>

            <select
              className="w-full mb-4 p-2 border rounded"
              value={newOfficer.department}
              disabled={!departments.length}
              onChange={(e) =>
                setNewOfficer({ ...newOfficer, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateOfficer}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Create Officer
            </button>
          </div>
        </div>
      )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ManageOfficers;
