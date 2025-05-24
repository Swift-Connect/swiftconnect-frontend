import { useState } from "react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import ActionPopUp from "../../components/actionPopUp";

const APIManagementTable = ({
  data,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  isLoading
}) => {
  const columns = [
    "Gateway",
    "Status",
    "Last Updated",
    "Available Gateways",
    "Actions"
  ];

  const [activeRow, setActiveRow] = useState(null);

  const handleActionClick = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00613A]"></div>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="py-4 px-6 text-left text-sm font-medium text-gray-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedData.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 px-6">
                  <span className="capitalize">{item.active_gateway}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.active_gateway ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.active_gateway ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {formatDate(item.updated_at)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {item.available_gateways?.split(',').map((gateway, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm capitalize"
                      >
                        {gateway.trim()}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item.id, { ...item, active_gateway: item.active_gateway })}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default APIManagementTable;
