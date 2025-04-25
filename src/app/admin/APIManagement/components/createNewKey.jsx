export default function CreateNewKey({ onClose }) {
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
          Generate API Key <span>🔑</span>
        </h2>

        <div className="space-y-4">
          <label>API KEY NAME</label>
          <input
            type="text"
            placeholder="API KEY NAME"
            className="w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring"
          />

          <div className="relative">
            <label>API KEY</label>
            <input
              type="text"
              value="******************************"
              readOnly
              className="w-full border rounded-xl px-4 py-4 pr-10 text-gray-500"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-black">
              📋
            </button>
          </div>
          <div className="flex flex-col">
            <label>Permissions / Type of access</label>
            <select className="w-full border rounded-xl px-4 py-4 text-gray-500 focus:outline-none">
              <option>Select</option>
              <option>Read</option>
              <option>Write</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label>Permissions / Type of access</label>
            <div className="flex gap-2">
              <input
                type="number"
                defaultValue={30}
                className="w-1/2 border rounded-xl px-4 py-4 focus:outline-none"
              />
              <select className="w-1/2 border rounded-xl px-4 py-4 text-gray-500 focus:outline-none">
                <option>Days</option>
                <option>Weeks</option>
                <option>Months</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Never Expire</span>
          </label>

          <div className="flex justify-between gap-4 mt-6  ">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-4 w-[40%] bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
            >
              Cancel
            </button>
            <button className="px-6 py-4 w-[40%] bg-black text-white rounded-xl hover:opacity-90">
              Generative Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
