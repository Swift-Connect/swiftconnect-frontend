import { useState } from "react";

const EditSAM = ({ rowData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(rowData || {});

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData); // Pass the updated data back to the parent
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Data</h2>
      <form className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex items-center gap-4">
            <label className="block text-lg font-medium text-gray-700 w-1/4">
              {key.replace(/_/g, " ")}:
            </label>
            <input
              type="text"
              value={formData[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-3/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        ))}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSAM;
