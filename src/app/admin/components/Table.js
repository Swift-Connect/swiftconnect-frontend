const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            {columns.map((col, index) => (
              <th key={index} className="p-3 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
