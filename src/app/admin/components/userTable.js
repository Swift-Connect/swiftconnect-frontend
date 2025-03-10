import Table from "./Table";

const UsersTable = () => {
  const columns = ["ID", "Name", "Email", "Status"];
  const data = [
    {
      id: 1,
      username: "John Doe",
      account_id: 5777,
      created_at: "2/4/2025",
      api_response: "Api Response",
    },
  ];
  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users yet</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#525252]">
              <th className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                <input type="checkbox" />
              </th>
              <th className="py-[1.3em] px-[1.8em]">Username</th>
              <th className="py-[1.3em] px-[1.8em]">Account Id</th>
              <th className="py-[1.3em] px-[1.8em]">Date</th>
              <th className="py-[1.3em] px-[1.8em]">Action</th>
              <th className="py-[1.3em] px-[1.8em]">API Response</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  <input type="checkbox" />
                </td>
                <td className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                  {user.username}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  #{user.account_id}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {new Date(user.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  Processing
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user.api_response}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UsersTable;
