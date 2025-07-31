
import React from 'react';

const Card = ({ title, value, icon, bgColor = 'bg-blue-500', textColor = 'text-white', trend, trendValue }) => {
  return (
    <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90 mb-1">{title}</h3>
          <p className="text-3xl font-bold mb-2">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
              <span className="mr-1">
                {trend === 'up' ? '↗' : '↘'}
              </span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-full">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
