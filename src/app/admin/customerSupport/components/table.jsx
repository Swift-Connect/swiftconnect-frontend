import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";
import Image from "next/image";

const CustomerSupportTable = ({
  data,
  currentPage,
  itemsPerPage,
  setShowEdit,
}) => {
  const columns = [
    "TicketID",
    "Subject",
    "Priority",
    "Type",
    "Requester",
    "Customer Support",
    "Request Date",
    "Platform",

    "Status",
  ];

  const [checkedItems, setCheckedItems] = useState(
    new Array(data.length).fill(false)
  );
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const handleHeaderCheckboxChange = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);
    setCheckedItems(new Array(data.length).fill(newCheckedState));
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsAllChecked(newCheckedItems.every((item) => item));
  };

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  // ** PAGINATION LOGIC **
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Users yet</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#F9F8FA] text-left text-[#525252]">
              <th className="py-[1.3em] px-[1.8em] font-semibold text-[#232323]">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-[1.3em] px-[1.8em] whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((user, idx) => (
              <tr
                key={idx}
                className={`border-t ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
                onDoubleClick={() => setShowEdit(user)}
              >
                <td className="py-[1.3em] px-[1.8em]">
                  <input
                    type="checkbox"
                    checked={checkedItems[startIndex + idx]}
                    onChange={() => handleCheckboxChange(startIndex + idx)}
                  />
                </td>
                <td className="py-[1.3em] whitespace-nowrap px-[1.8em] font-semibold">
                  {user?.ticket_id}
                </td>
                <td className="py-[1.3em] whitespace-nowrap px-[1.8em] text-[#9CA3AF]">
                  #{user?.subject}
                </td>
                <td
                  className={`py-[1.3em] px-[1.8em]    ${
                    user?.priority === "Low"
                      ? " text-green-600"
                      : user?.priority === "Medium"
                      ? "  text-yellow-500"
                      : user?.priority === "High"
                      ? " text-red-600"
                      : ""
                  }`}
                >
                  <div
                    className={`flex w-fit items-center justify-center gap-2 px-3 py-1 rounded-2xl ${
                      user?.priority === "Low"
                        ? "bg-green-100"
                        : user?.priority === "Medium"
                        ? "bg-yellow-100"
                        : user?.priority === "High"
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-[.7em] h-[.7em] rounded-full   ${
                        user?.priority === "Low"
                          ? "bg-green-600  "
                          : user?.priority === "Medium"
                          ? "bg-yellow-500  "
                          : user?.priority === "High"
                          ? "bg-red-600 "
                          : ""
                      }`}
                    ></div>
                    {user?.priority}
                  </div>
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.type}
                </td>
                <td className="py-[1.3em] whitespace-nowrap px-[1.8em] text-[#9CA3AF]">
                  {user?.requester}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.customer_support}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  {user?.req_date}
                </td>
                <td className="py-[1.3em] px-[1.8em] text-[#9CA3AF]">
                  <div className="w-[2em] h-[2em] bg-[#e2e3e6] rounded-full flex items-center justify-center">
                    <Image src={"/" + user?.platform} width={20} height={0} />
                  </div>
                </td>

                <td className="py-[1.3em] px-[1.8em] text-[#fff] relative">
                  <span
                    className="bg-[#00613A] rounded-xl flex w-fit items-center justify-center gap-2 py-1 px-2 cursor-pointer"
                    onClick={() => handleActionClick(idx)}
                  >
                    Approved <FaChevronDown />
                  </span>
                  {activeRow === idx && <ActionPopUp />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CustomerSupportTable;
