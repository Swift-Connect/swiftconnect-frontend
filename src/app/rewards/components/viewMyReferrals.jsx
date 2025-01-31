import { ChevronLeft } from "lucide-react";

export default function Referrals({ onBack }) {
  const users = [
    {
      id: 1,
      username: "RichardOkorie",
      phone: "08023929243",
      email: "ro@gmail.com",
      status: "User",
      date: "19/11/2024",
    },
    {
      id: 2,
      username: "Mentlala",
      phone: "08023929243",
      email: "mentlala@gmail.com",
      status: "Agent",
      date: "19/11/2024",
    },
    {
      id: 3,
      username: "WoleAbraham",
      phone: "08023929243",
      email: "wa@gmail.com",
      status: "Agent",
      date: "19/11/2024",
    },
    {
      id: 4,
      username: "Benjamin",
      phone: "08023929243",
      email: "benjamin@gmail.com",
      status: "Agent",
      date: "19/11/2024",
    },
    {
      id: 5,
      username: "JaneFabrics",
      phone: "08023929243",
      email: "Janefabrics@gmail.com",
      status: "Agent",
      date: "19/11/2024",
    },
    {
      id: 6,
      username: "PrincessEkemini",
      phone: "08023929243",
      email: "Princess@gmail.com",
      status: "User",
      date: "19/11/2024",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fbf6]">
      <div className="w-full max-w-4xl bg-whit rounded-lg ">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          onClick={onBack}
        >
          <ChevronLeft /> Back
        </button>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg ">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#F9F8FA] text-gray-700 font-bold text-left text-sm">
                <th className="p-5">S/N</th>
                <th className="p-5">Username</th>
                <th className="p-5">Phone</th>
                <th className="p-5">Email</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50  text-sm"
                >
                  <td className="p-5 font-bold">{index + 1}.</td>
                  <td className="p-5">{user.username}</td>
                  <td className="p-5 text-[#9CA3AF]">{user.phone}</td>
                  <td className="p-5 text-[#9CA3AF]">{user.email}</td>
                  <td className="p-5 text-[#9CA3AF] ">{user.status}</td>
                  <td className="p-5  text-[#9CA3AF]">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
