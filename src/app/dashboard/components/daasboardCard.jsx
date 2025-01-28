export default function DashboardCard({
  title,
  icon,
  bgColor,
  setPayBillsType,
  description
}) {
  return (
    <div
      className={`flex gap-4 justify-between flex-col rounded-[1.5em] p-4 bg-[#ffffff] border-[0.5px] border-[#efefef] cursor-pointer hover:bg-[#dfdfdf]`}
      onClick={() => setPayBillsType(title)}
    >
      <div className="flex items-center gap-6 justify-between">
        <h1 className="text-[24px] font-semibold">{title}</h1>

        <img src={icon} alt={title} className="h-6 w-6" />
      </div>
      <span className="text-[#9CA3AF]">
        {description ? description : "Pay Bills"}
      </span>
    </div>
  );
}
