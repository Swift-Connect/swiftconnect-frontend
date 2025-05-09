import React, { useEffect, useState } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt } from "react-icons/fa";
import TableTabs from "../../components/tableTabs";
import Table from "./table";
import Pagination from "../../components/pagination";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";
import { deleteData } from "@/api";

const ApiDetails = ({ title, setCard, path }) => {
  const [activeTabPending, setActiveTabPending] =
    React.useState("All Transaction");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlanData, setNewPlanData] = useState({ name: "", price: "" }); // adjust fields as needed
  const [formData, setFormData] = useState({
    url: "",
    api_key: "",
    status: "active",
    request_template: "{}",
    response_template: "{}",
    plan_ids: "",
    waec_price: "",
    neco_price: "",
  });

  const formFieldsByPath = {
    "airtime-topups": [
      "url",
      "api_key",
      "status",
      "request_template",
      "response_template",
    ],
    "bulk-sms": [
      "url",
      "api_key",
      "status",
      "request_template",
      "response_template",
    ],
    "cable-recharges": ["url", "api_key", "status", "plan_ids"],
    "data-plans": ["url", "api_key", "status", "plan_ids"],
    education: [
      "url",
      "api_key",
      "status",
      "request_template",
      "response_template",
      "waec_price",
      "neco_price",
    ],
    electricity: ["url", "api_key", "status"],
  };

  const renderFormFields = () => {
    const fields = formFieldsByPath[path] || [];

    return fields.map((field) => {
      if (field === "status") {
        return (
          <select
            key={field}
            className="border p-2 rounded"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      } else if (
        field === "request_template" ||
        field === "response_template"
      ) {
        return (
          <textarea
            key={field}
            placeholder={`${field.replace("_", " ")} (JSON)`}
            className="border p-2 rounded"
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        );
      } else {
        return (
          <input
            key={field}
            type="text"
            placeholder={field.replace("_", " ").toUpperCase()}
            className="border p-2 rounded"
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        );
      }
    });
  };

  const [data, setData] = useState();
  const fetchAllPages = async (endpoint, maxPages = 50) => {
    let allData = [];

    try {
      const res = await api.get(`/services/configure/${path}/`);

      console.log("the dede", res.data[0].plans);
      setData(res.data[0]);
    } catch (error) {
      toast.error(`Error fetching data from ${endpoint}`);
      console.error(`Error fetching ${endpoint}:`, error);
    }

    // return allData;
  };

  useEffect(() => {
    fetchAllPages();
  }, [formData]);

  // console.log("the data", data);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data?.plans?.length / itemsPerPage);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("from API details", totalPages);

  const loadingToast = toast.loading("Logging in...");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const allowedFields = formFieldsByPath[path] || [];
      const payload = {};

      for (let field of allowedFields) {
        if (field === "request_template" || field === "response_template") {
          payload[field] = JSON.parse(formData[field] || "{}");
        } else {
          payload[field] = formData[field];
        }
      }

      console.log("Submitting payload:", payload);

      const res = await api.post(`/services/configure/${path}/`, payload);
      toast.success("Plan added!");
      console.log("Success:", res);
      setShowAddModal(false);
    } catch (err) {
      toast.error("Failed to add plan");
      console.error("Error:", err);
    }
  };

  const onDelete = async (id) => {
    console.log("Deleting item with ID:", id);
    setIsLoading(true);

    try {
      const res = await api.delete(`/services/configure/${path}/${id}/`);
      toast.success("Plan deleted successfully!");
      console.log("Delete success:", res);
      toast.update(loadingToast, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setShowAddModal(false);
    } catch (err) {
      toast.update(loadingToast, {
        render: "Failed Deleting Data:" + errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8 justify-between">
        <ToastContainer />
        <h1 className="text-[16px] font-semibold flex items-center gap-4">
          <span className="text-[#9CA3AF]" onClick={() => setCard(null)}>
            Service Management API
          </span>
          <FaChevronRight /> {title} Settings
        </h1>
      </div>

      <h1 className="text-[16px] font-semibold mb-8">{title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[80%] mb-8">
        <form className="space-y-4 flex flex-col gap-8">
          {/*User Info*/}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-[2em]">
              <label className="block text-[18px] font-medium text-gray-700 w-[150px]">
                {title} Key
              </label>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={data?.api_key}
                  className="w-full mt-1 p-4 border rounded-[0.8em] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  disabled
                />
                <p className="text-[14px] text-gray-500">
                  Requires 50 characters or fewer, digits and @#?/+- only
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <button
        className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Plan <FaPlus />
      </button>

      {/* <div className="flex items-center gap-[3em] mb-8">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Save <FaPlus />
        </button>
        <button className="bg-[#8C1823] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Delete <FaTrashAlt />
        </button>
      </div> */}
      <div className="pt-8 max-md-[400px]:hidden">
        {/* <TableTabs
          header={"Payment Log"}
          setActiveTab={setActiveTabPending}
          activeTab={activeTabPending}
          tabs={["All Transaction", "Inactive", "Recently Added"]}
          from="SAMM"
          onPress={() => {}}
        /> */}
        <div className="rounded-t-[1em] overflow-auto border border-gray-200 min-h-[50vh]">
          <Table
            data={data?.plans || []}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onDelete={onDelete}

            //   setShowEdit={handleEditClick}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || []}
          onPageChange={setCurrentPage}
        />
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Plan</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00613A] text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDetails;
