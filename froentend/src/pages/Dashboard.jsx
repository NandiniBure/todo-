import React, { useEffect, useState } from "react";
import api from "../Serveices/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    completedPercentage: 0,
    avgTimePerTask: 0,
    pendingTaskSummary: {
      totalPendingTasks: 0,
      totalTimeLapsed: 0,
      totalTimeLeft: 0,
    },
    taskPrioritySummary: {},
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/tasks/dashboard-stats");
        setDashboardData(response.data);
      } catch (error) {
        console.error(
          "Error fetching dashboard stats:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchDashboardStats();
  }, []);

  const {
    totalTasks,
    completedPercentage,
    avgTimePerTask,
    pendingTaskSummary,
    taskPrioritySummary,
  } = dashboardData;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
      </header>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-600">
            Total Tasks
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
            {totalTasks}
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-600">
            Tasks Completed
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
            {completedPercentage}%
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-600">
            Avg Time Per Task
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
            {avgTimePerTask} mins
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Pending Task Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-600">Pending Tasks</h3>
            <p className="text-2xl font-bold text-purple-600">
              {pendingTaskSummary?.totalPendingTasks || 0}
            </p>
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-600">
              Total Time Lapsed
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {pendingTaskSummary?.totalTimeLapsed?.toFixed(2) || 0} mins
            </p>
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h3 className="text-lg font-bold text-gray-600">
              Estimated Time Left
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {pendingTaskSummary?.totalTimeLeft?.toFixed(2) || 0} mins
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Task Priority
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md text-sm sm:text-base">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Task Priority</th>
                <th className="py-2 px-4 text-left">Pending Tasks</th>
                <th className="py-2 px-4 text-left">Time Lapsed</th>
                <th className="py-2 px-4 text-left">Time to Finish</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(taskPrioritySummary).map(([priority, data]) => (
                <tr key={priority} className="border-b">
                  <td className="py-2 px-4">{priority}</td>
                  <td className="py-2 px-4">{data.pending || 0}</td>
                  <td className="py-2 px-4">
                    {data.timeLapsed?.toFixed(2) || 0}
                  </td>
                  <td className="py-2 px-4">
                    {data.timeLeft?.toFixed(2) || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
