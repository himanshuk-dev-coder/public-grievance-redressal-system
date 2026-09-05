const StatusTimeline = ({ logs }) => (
  <div className="border-l-2 border-indigo-500 pl-4 space-y-4">
    {logs.map((log) => (
      <div key={log._id}>
        <p className="text-sm text-gray-600">
          {new Date(log.createdAt).toLocaleString()}
        </p>
        <p className="font-semibold">
          {log.action.replace("_", " ")}
        </p>
        <p className="text-xs text-gray-500">
          By {log.role}
        </p>
      </div>
    ))}
  </div>
);

export default StatusTimeline;