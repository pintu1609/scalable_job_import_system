"use client";

import { useHistory } from "@/hook/importhistory";

export default function Home() {
  const { data, isPending, isError, error } = useHistory();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading import history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">
        Import History Tracking
      </h1>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Feed URL</th>
              <th className="px-4 py-3 text-center">Total</th>
              <th className="px-4 py-3 text-center">New</th>
              <th className="px-4 py-3 text-center">Updated</th>
              <th className="px-4 py-3 text-center">Failed</th>
              <th className="px-4 py-3 text-left">Started At</th>
              <th className="px-4 py-3 text-left">Finished At</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.map((log, index) => (
              <tr
                key={log._id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 max-w-xs truncate text-blue-600">
                  {log.feedUrl}
                </td>

                <td className="px-4 py-3 text-center font-medium">
                  {log.totalFetched}
                </td>

                <td className="px-4 py-3 text-center text-green-600 font-medium">
                  {log.newJobs}
                </td>

                <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                  {log.updatedJobs}
                </td>

                <td className="px-4 py-3 text-center text-red-600 font-medium">
                  {log.failedJobs.length}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(log.startedAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {log.finishedAt ? (
                    <span className="text-gray-600">
                      {new Date(log.finishedAt).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-orange-600 font-medium">
                      Running
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {data?.data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No import history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
