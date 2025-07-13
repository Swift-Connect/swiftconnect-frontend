export default function DashboardCard({
  title,
  icon,
  bgColor,
  setPayBillsType,
  description
}) {
  return (
    <div
      className={`flex  sm:gap-4 justify-between flex-col  rounded-lg sm:rounded-xl w-full p-2 sm:p-3 bg-[#ffffff] border border-[#efefef] cursor-pointer hover:bg-[#dfdfdf]`}
      onClick={() => setPayBillsType(title)}
    >
      <div className="flex items-center gap-3 sm:gap-6 max-md-[400px]:p-4 justify-between">
        <h1 className="text-base sm:text-lg font-semibold">
          {title}
        </h1>

        <img src={icon} alt={title} className="h-6 w-6 " />
      </div>
      <span className="text-[#9CA3AF] hidden sm:block text-xs">
        {description ? description : "Pay Bills"}
      </span>
    </div>
  );
}
