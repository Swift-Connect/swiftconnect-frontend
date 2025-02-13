export default function IDValidationForm() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-6">
          Select the type of ID to Validate
        </h2>

        <form className="space-y-4">
          {/* Verification Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Verification Type:
            </label>
            <select className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
              <option>Select a Verification Type</option>
              <option>Passport</option>
              <option>Driver's License</option>
              <option>National ID</option>
            </select>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-md"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
