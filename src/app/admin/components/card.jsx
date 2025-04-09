const Card = ({ icon, title, value, bgColor, textColor }) => {
  return (
    <div
      className={`p-4 rounded-2xl flex items-center gap-4 shadow  ${bgColor}`}
    >
      <div className="bg-gray-200 p-2 rounded-full">{icon}</div>
      <div>
        <p
          className={`text-[14px] ${
            title === "Total Revenue" ? "text-whit" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <h2
          className={`text-l  ${
            title === "Total Revenue" ? "font-medium" : " font-bold"
          }  ${textColor}`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
};

export default Card;