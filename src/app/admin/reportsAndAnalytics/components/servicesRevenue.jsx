// components/ServiceRevenue.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const services = [
  {
    title: "Airtime Purchases",
    amount: "₦75,000",
    icon: "👥",
    growth: "8.5%",
    growthText: "Up from yesterday",
    growthPositive: true,
  },
  {
    title: "Internet Subscriptions",
    amount: "₦60,000",
    icon: "🎓",
    growth: "1.3%",
    growthText: "Up from past week",
    growthPositive: true,
  },
  {
    title: "Electricity Bill Payments",
    amount: "₦150,000",
    icon: "📈",
    growth: "4.3%",
    growthText: "Down from yesterday",
    growthPositive: false,
  },
  {
    title: "Cable TV Payments",
    amount: "₦45,000",
    icon: "⏲️",
    growth: "1.8%",
    growthText: "Up from yesterday",
    growthPositive: true,
  },
];

export default function ServiceRevenue() {
  return (
    <div className="p-6 bg-green-50">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Service Revenue
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm">{service.title}</h3>
              <div className="bg-gray-100 p-2 rounded-full text-2xl">
                {service.icon}
              </div>
            </div>
            <div className="text-2xl font-bold">{service.amount}</div>
            <div className="flex items-center text-sm">
              {service.growthPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500 mr-1" />
              )}
              <span
                className={`font-medium ${
                  service.growthPositive ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {service.growth}
              </span>
              <span className="text-gray-500 ml-1">{service.growthText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
