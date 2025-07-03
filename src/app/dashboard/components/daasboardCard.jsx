export default function DashboardCard({
  title,
  icon,
  bgColor,
  setPayBillsType,
  description
}) {
  return (
    <div
      className={`flex gap-2 sm:gap-4 justify-between flex-col rounded-lg sm:rounded-xl p-2 sm:p-3 bg-[#ffffff] border border-[#efefef] cursor-pointer hover:bg-[#dfdfdf]`}
      onClick={() => setPayBillsType(title)}
    >
      <div className="flex items-center gap-3 sm:gap-6 justify-between">
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
