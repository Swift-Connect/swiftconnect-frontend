import React, { useState } from "react";
import EditMonthlyPlanModal from "./editBillingModal";

const plans = {
  monthly: [
    { name: "Basic plan", price: 10, subscribers: 100 },
    { name: "Premium plan", price: 20, subscribers: 1200 },
    { name: "Enterprise plan", price: 30, subscribers: 1030 },
  ],
  yearly: [
    { name: "Basic plan", price: 10, subscribers: 100 },
    { name: "Premium plan", price: 20, subscribers: 1200 },
    { name: "Enterprise plan", price: 30, subscribers: 1030 },
  ],
};

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("Basic plan");
const [open, setOpen] = useState(true);
  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    };
    

// handlePlanSelect(plan.name);
  return (
    <div className="w-full">
      <EditMonthlyPlanModal open={open} setOpen={setOpen} />
      {/* Monthly Section */}
      <div className="mb-10">
        <div className="flex flex-col mb-4">
          <h2 className="text-[14px] font-semibold">Monthly</h2>
          <p className="text-sm text-[#9CA3AF] ">Edit monthly plan here</p>
        </div>
        <div className="flex justify-between ">
          {plans.monthly.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-xl p-6 relative ${
                selectedPlan === plan.name
                  ? "border-green-600 shadow-md"
                  : "border-gray-300"
              }`}
            >
              {/* Last Edited */}

              <div className="flex justify-between">
                <h3 className="text-[16px] font-semibold ">{plan.name}</h3>
                <div className=" text-[11px] bg-gray-100 px-2 py-1 rounded-full">
                  last edited 4 days
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                {plan.subscribers} Subscribers
              </p>

              <div className="text-3xl font-bold mb-2">${plan.price}</div>
              <p className="text-gray-500 mb-6">per month</p>

              <button
                className={`w-full py-2 rounded-lg ${
                  selectedPlan === plan.name
                    ? "bg-[#00613A] text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setOpen(true)}
              >
                Edit plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col mb-4">
            <h2 className="text-[14px] font-semibold">Yearly</h2>
            <p className="text-sm text-[#9CA3AF] ">Edit yearly plan here</p>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Edit yearly plan here
          </a>
        </div>
        <div className="flex justify-between ">
          {plans.yearly.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-xl p-6 relative border-gray-300"
            >
              <div className="flex justify-between">
                <h3 className="text-[16px] font-semibold ">{plan.name}</h3>
                <div className=" text-[11px] bg-gray-100 px-2 py-1 rounded-full">
                  last edited 4 days
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                {plan.subscribers} Subscribers
              </p>

              <div className="text-3xl font-bold mb-2">${plan.price}</div>
              <p className="text-gray-500 mb-6">per year</p>

              <button className="w-full py-2 rounded-lg bg-gray-200 text-black">
                Edit plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
