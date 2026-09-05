export const STATUS_FLOW = {
  Submitted: ["Under Review"],
  "Under Review": ["In Progress", "Rejected"],
  "In Progress": ["Resolved"],
  Resolved: ["Closed"]
};

const getStatusBadge = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-yellow-500";
    case "In Progress":
      return "bg-blue-500";
    case "Resolved":
      return "bg-green-600";
    case "Rejected":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
};
