import { Mail, Users, Send, BarChart3, Clock, Smartphone } from "lucide-react";

const stats = [
  {
    label: "Open rate",
    value: "12.2%",
    iconBg: "bg-violet-100",
    icon: <Users className="text-violet-600 w-5 h-5" />,
    sub: [{ icon: <Mail className="w-4 h-4" />, value: "87%" }],
  },
  {
    label: "Delivery Rate",
    value: "99.47%",
    iconBg: "bg-yellow-100",
    icon: <Send className="text-yellow-500 w-5 h-5" />,
    sub: [
      { icon: <Mail className="w-4 h-4" />, value: "87%" },
      { icon: <Smartphone className="w-4 h-4" />, value: "87%" },
    ],
  },
  {
    label: "Total Message Sent",
    value: "20,978",
    iconBg: "bg-green-100",
    icon: <BarChart3 className="text-green-600 w-5 h-5" />,
    sub: [
      { icon: <Mail className="w-4 h-4" />, value: "19,874" },
      { icon: <Smartphone className="w-4 h-4" />, value: "900" },
    ],
  },
  {
    label: "Total Message Count",
    value: "6",
    iconBg: "bg-orange-100",
    icon: <Clock className="text-orange-500 w-5 h-5" />,
    sub: [
      { icon: <Mail className="w-4 h-4" />, value: "4" },
      { icon: <Smartphone className="w-4 h-4" />, value: "2" },
    ],
  },
];

export default function PerformanceStats() {
  return (
    <div className="bg-[#f6fcf7] p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-4">Monitor Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-full ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              {stat.sub.map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  {item.icon}
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
