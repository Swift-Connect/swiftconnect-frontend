import { FaPlus } from "react-icons/fa";

export default function Form({formData}) {
  return (
    <form className="flex-1 grid grid-cols-2 gap-6">
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Your Name</label>
        <input
          type="text"
          className="border rounded-lg p-2"
          value={formData.name}
        />
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">User Name</label>
        <input
          type="text"
          className="border rounded-lg p-2"
          value={formData.username}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Email</label>
        <input
          type="email"
          className="border rounded-lg p-2"
          value={formData.email}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Password</label>
        <input
          type="password"
          className="border rounded-lg p-2"
          value={formData.password}
        />
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Date of Birth</label>
        <input
          type="date"
          className="border rounded-lg p-2"
          value={formData.dob}
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Present Address</label>
        <input
          type="text"
          className="border rounded-lg p-2"
          value={formData.address}
        />
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">City</label>
        <input
          type="text"
          className="border rounded-lg p-2"
          value={formData.city}
        />
      </div>

      {/* Country */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Country</label>
        <input
          type="text"
          className="border rounded-lg p-2"
          value={formData.country}
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-[3em] mb-8">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Save <FaPlus />
        </button>
      </div>
    </form>
  );
}
