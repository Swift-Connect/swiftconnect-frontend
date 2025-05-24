import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateNewKey({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    active_gateway: "",
    available_gateways: ["flutterwave", "paystack", "monify"]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
          Configure Payment Gateway <span>🔑</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-2">Active Gateway</label>
            <select 
              className="w-full border rounded-xl px-4 py-4 text-gray-500 focus:outline-none"
              value={formData.active_gateway}
              onChange={(e) => setFormData({...formData, active_gateway: e.target.value})}
              required
            >
              <option value="">Select Gateway</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="paystack">Paystack</option>
              <option value="monify">Monify</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#00613A] text-white rounded-lg hover:bg-[#004d2e]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
