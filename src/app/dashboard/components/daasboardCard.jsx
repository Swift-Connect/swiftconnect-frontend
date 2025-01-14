export default function DashboardCard({ title, icon, bgColor }) {
  return (
    <div
      className={`flex gap-4 justify-between flex-col rounded-[1.5em] p-4 bg-[#ffffff] border-[0.5px] border-[#efefef]`}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] ">{title}</h1>

        <img src={icon} alt={title} className="h-6 w-6" />
      </div>
      <span className="text-[#9CA3AF]">Pay Bills</span>
    </div>
  );
}
