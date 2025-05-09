// components/EditForm.js
import { useState } from "react";
import axios from "axios";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";

const EditForm = ({ item, onClose, path }) => {
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleSubmit = async (e) => {
          const loadingToast = toast.loading("Please wait ...");
    e.preventDefault();
    try {
      const endpoint = `/services/configure/${path}/${item.id}/`;
      await api.put(endpoint, formData);
      toast.update(loadingToast, {
        render: "Uodated successful!y",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      onClose(); // close form
    } catch (error) {
      console.error("Error updating data:", error);
      toast.update(loadingToast, {
        render: "Failed Deleting Data:" + error?.response?.data?.detail,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Edit Entry</h2>

      {Object.keys(item).map((key) => (
        <div key={key} className="mb-3">
          <label className="block text-gray-700 text-sm mb-1">{key}</label>
          <input
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditForm;
