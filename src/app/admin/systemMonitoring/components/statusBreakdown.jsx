import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock,
  Activity,
  Timer,
} from "lucide-react";

const cards = [
  {
    title: "Current Status",
    value: "Up",
    icon: <Users className="text-purple-500" />,
    change: "8.5% Up from yesterday",
    changeType: "up",
  },
  {
    title: "Uptime",
    value: "99.47%",
    icon: <Activity className="text-yellow-500" />,
    change: "1.3% Up from past week",
    changeType: "up",
  },
  {
    title: "Downtime",
    value: "3hrs, 17mins",
    icon: <Clock className="text-green-500" />,
    change: "4.3% Down from yesterday",
    changeType: "down",
  },
  {
    title: "Last downtime",
    value: "Jun 20, 2018\n3:18a.m. GMT",
    icon: <Timer className="text-orange-500" />,
    change: "Lasted for 19 minutes",
    changeType: "neutral",
  },
];

export default function StatusBreakdown() {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Breakdown</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{card.title}</span>
              <div className="bg-gray-100 p-2 rounded-full">{card.icon}</div>
            </div>
            <div className="text-xl font-bold whitespace-pre-line">
              {card.value}
            </div>
            {card.changeType !== "neutral" && (
              <div
                className={`flex items-center text-sm font-medium ${
                  card.changeType === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.changeType === "up" ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {card.change}
              </div>
            )}
            {card.changeType === "neutral" && (
              <div className="text-sm text-gray-500">{card.change}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
