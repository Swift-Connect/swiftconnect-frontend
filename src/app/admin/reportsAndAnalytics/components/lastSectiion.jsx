import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const agents = [
  {
    name: "Praise Akinde",
    referrals: 2500,
    volume: "$14,000",
    completion: 60,
  },
  {
    name: "Bootstrap Technologies",
    referrals: 2000,
    volume: "$20,500",
    completion: 100,
  },
  {
    name: "Community First",
    referrals: 1800,
    volume: "$9,800",
    completion: 75,
  },
];

const engagementData = [
  { day: "S", active: 40, inactive: 30 },
  { day: "M", active: 50, inactive: 70 },
  { day: "T", active: 45, inactive: 55 },
  { day: "W", active: 48, inactive: 72 },
  { day: "T", active: 50, inactive: 50 },
  { day: "F", active: 55, inactive: 90 },
  { day: "S", active: 30, inactive: 40 },
  { day: "M", active: 45, inactive: 45 },
  { day: "T", active: 48, inactive: 55 },
  { day: "W", active: 50, inactive: 50 },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Top-performing agents */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Top-performing agents</h2>
        <p className="text-sm text-gray-500 mb-6">
          Based on referrals and transaction volume
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3">Agents</th>
                <th className="py-3">No of Referrals</th>
                <th className="py-3">Transaction Volume</th>
                <th className="py-3">Completion</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <span className="font-medium">{agent.name}</span>
                  </td>
                  <td className="text-blue-600 py-4">
                    {agent.referrals.toLocaleString()}
                  </td>
                  <td className="py-4">{agent.volume}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span>{agent.completion}%</span>
                      <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${
                            agent.completion === 100
                              ? "bg-green-500"
                              : "bg-blue-600"
                          }`}
                          style={{ width: `${agent.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Engagement Trends */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Users Engagement trends</h2>
          <span className="text-sm text-gray-500">This Week</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="active"
              fill="#2563EB"
              name="Active"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="inactive"
              fill="#67E8F9"
              name="Inactive"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
