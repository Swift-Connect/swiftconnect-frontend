"use client";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { FaChevronRight, FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";

const ApiDetails = ({ title, setCard, path }) => {
  // State declarations
  const [isLoading, setIsLoading] = useState(true);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedApi, setEditedApi] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showAddExistingPlansModal, setShowAddExistingPlansModal] = useState(false);
  const [existingPlansSearchTerm, setExistingPlansSearchTerm] = useState("");
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [selectedExistingPlans, setSelectedExistingPlans] = useState([]);
  const [editPlan, setEditPlan] = useState(null);
  const [newPlans, setNewPlans] = useState([
    { name: "", plan_id: "", price: "", description: "", status: "active" },
  ]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);

  const apiListRef = useRef(null);

  // Form configuration
  const formFieldsByPath = {
    "airtime-topups": ["url", "api_key", "status", "request_template", "response_template", "secret_key", "public_key"],
    "bulk-sms": ["url", "api_key", "status", "request_template", "response_template", "secret_key", "public_key"],
    "cable-recharges": ["url", "api_key", "status", "plan_ids", "secret_key", "public_key"],
    "data-plans": ["url", "api_key", "status", "plan_ids", "secret_key", "public_key"],
    "education": ["url", "api_key", "status", "request_template", "response_template", "waec_price", "neco_price", "secret_key", "public_key"],
    "electricity": ["url", "api_key", "status", "secret_key", "public_key"],
  };

  // Form data initialization
  const initialFormData = {
    url: "",
    api_key: "",
    status: "active",
    request_template: "{}",
    response_template: "{}",
    plan_ids: [],
    waec_price: "",
    neco_price: "",
    secret_key: "",
    public_key: "",
  };
  const [formData, setFormData] = useState(initialFormData);


    // Plan operations
    const getFilteredPlans = useCallback(() => {
      let filtered = availablePlans;
  
      if (path === "cable-recharges") {
        filtered = filtered.filter(plan =>
          ["dstv", "gotv", "startimes"].some(term => 
            plan.name.toLowerCase().includes(term)
          ));
      } else if (path === "data-plans") {
        filtered = filtered.filter(plan =>
          ["mtn", "airtel", "glo", "9mobile"].some(term =>
            plan.name.toLowerCase().includes(term)
          ));
      }
  
      if (searchTerm) {
        filtered = filtered.filter(plan =>
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.price.toString().includes(searchTerm)
        );
      }
  
      return filtered;
    }, [availablePlans, path, searchTerm]);


  const getFilteredExistingPlans = useCallback(() => {
    let filtered = availablePlans;

    if (!showAllPlans) {
      if (path === "cable-recharges") {
        filtered = filtered.filter(plan =>
          ["dstv", "gotv", "startimes"].some(term =>
            plan.name.toLowerCase().includes(term)
          ));
      } else if (path === "data-plans") {
        filtered = filtered.filter(plan =>
          ["mtn", "airtel", "glo", "9mobile"].some(term =>
            plan.name.toLowerCase().includes(term)
          ));
      }
    }

    if (existingPlansSearchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(existingPlansSearchTerm.toLowerCase()) ||
        plan.price.toString().includes(existingPlansSearchTerm)
      );
    }

    return filtered;
  }, [availablePlans, path, showAllPlans, existingPlansSearchTerm]);
  
  // Memoized values
  const filteredPlans = useMemo(() => getFilteredPlans(), [availablePlans, searchTerm, path]);
  const filteredExistingPlans = useMemo(() => getFilteredExistingPlans(), [
    availablePlans, 
    existingPlansSearchTerm, 
    path, 
    showAllPlans
  ]);

  // Debug effects
  useEffect(() => {
    console.log("ApiDetails mounted with path:", path);
  }, [path]);

  useEffect(() => {
    console.log("selectedApi changed:", selectedApi);
  }, [selectedApi]);

  // Data fetching
  const fetchApis = useCallback(async () => {
    setIsApiLoading(true);
    try {
      const res = await api.get(`/services/configure/${path}/?page=${page}&page_size=${pageSize}`);
      const newApis = res.data.results || res.data;
      const sortedApis = newApis.sort((a, b) => {
        if (a.status === "active" && b.status !== "active") return -1;
        if (a.status !== "active" && b.status === "active") return 1;
        return a.url.localeCompare(b.url);
      });
      
      setApis(prev => page === 1 ? sortedApis : [...prev, ...sortedApis]);
      setHasMore(!!res.data.next);

      // Update selected API only on initial load or if current selection is invalid
      if (page === 1) {
        if (sortedApis.length > 0) {
          if (!selectedApi || !sortedApis.some(api => api.id === selectedApi.id)) {
            const activeApi = sortedApis.find(api => api.status === "active") || sortedApis[0];
            setSelectedApi(activeApi);
          }
        } else {
          setSelectedApi(null);
        }
      }
    } catch (error) {
      console.error("Error fetching APIs:", error);
      toast.error("Error fetching APIs");
      if (page === 1) setSelectedApi(null);
    } finally {
      setIsApiLoading(false);
      setIsLoading(false);
    }
  }, [path, page, pageSize, selectedApi]);

  const fetchAvailablePlans = useCallback(async () => {
    try {
      const res = await api.get(`/services/configure/plans/`);
      setAvailablePlans(res.data);
    } catch (error) {
      toast.error("Error fetching available plans");
      console.error("Error fetching plans:", error);
    }
  }, []);

  useEffect(() => {
    fetchApis();
    fetchAvailablePlans();
  }, [fetchApis, fetchAvailablePlans]);

  // API selection management
  useEffect(() => {
    if (apis.length > 0 && (!selectedApi || !apis.some(api => api.id === selectedApi.id))) {
      const activeApi = apis.find(api => api.status === "active") || apis[0];
      setSelectedApi(activeApi);
    }
  }, [apis, selectedApi]);

  const handleApiSelect = useCallback((api) => {
    if (!api?.id) return;
    
    // Only update if it's a different API
    if (!selectedApi || selectedApi.id !== api.id) {
      setSelectedApi(api);
      setIsEditing(false);
      setEditedApi(null);
    }

    // Scroll to selected API
    if (apiListRef.current) {
      const cardWidth = 280;
      const cardIndex = apis.findIndex((a) => a.id === api.id);
      const scrollPosition = cardIndex * (cardWidth + 12);
      apiListRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [apis, selectedApi]);

  // API operations
  const handleStatusToggle = async (api, e) => {
    e.stopPropagation();
    if (!api?.id) return;

    setIsOperationLoading(true);
    const loadingToast = toast.loading("Updating API status...");
    try {
      const newStatus = api.status === "active" ? "inactive" : "active";
      const response = await api.patch(
        `/services/configure/${path}/${api.id}/`,
        { status: newStatus }
      );

      setApis(prev => prev.map(a => a.id === api.id ? response.data : a));
      
      if (selectedApi?.id === api.id) {
        setSelectedApi(response.data);
      }

      toast.update(loadingToast, {
        render: `API ${newStatus === "active" ? "activated" : "deactivated"}`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: "Error updating API status",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsOperationLoading(false);
    }
  };

  const onDelete = async (id, e) => {
    e.stopPropagation();
    if (!id) return;

    const loadingToast = toast.loading("Deleting API...");
    try {
      await api.delete(`/services/configure/${path}/${id}/`);
      const remainingApis = apis.filter(api => api.id !== id);
      setApis(remainingApis);

      if (selectedApi?.id === id) {
        const activeApi = remainingApis.find(a => a.status === "active") || remainingApis[0];
        setSelectedApi(activeApi || null);
      }

      toast.update(loadingToast, {
        render: "API deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(loadingToast, {
        render: "Failed to delete API: " + err.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };



  const handlePlanToggle = async (planId) => {
    if (!selectedApi?.id) {
      toast.error("No API selected");
      return;
    }

    const loadingToast = toast.loading("Updating API plans...");
    try {
      const existingPlanIds = selectedApi.plans?.map(plan => plan.id) || [];
      const newPlanIds = existingPlanIds.includes(planId)
        ? existingPlanIds.filter(id => id !== planId)
        : [...existingPlanIds, planId];

      const response = await api.put(
        `/services/configure/${path}/${selectedApi.id}/`,
        { plan_ids: newPlanIds }
      );

      setSelectedApi(response.data);
      setApis(prev => prev.map(api => 
        api.id === selectedApi.id ? response.data : api
      ));

      toast.update(loadingToast, {
        render: "API plans updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: "Failed to update plans",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Form handling
  const getRequiredFields = useCallback((api) => {
    const baseFields = {
      url: api.url,
      api_key: api.api_key,
      status: api.status,
    };

    switch (path) {
      case "cable-recharges":
      case "data-plans":
        return { ...baseFields, plan_ids: api.plan_ids || [] };
      case "education":
        return {
          ...baseFields,
          request_template: api.request_template || "{}",
          response_template: api.response_template || "{}",
          waec_price: api.waec_price || "",
          neco_price: api.neco_price || "",
        };
      case "airtime-topups":
      case "bulk-sms":
        return {
          ...baseFields,
          request_template: api.request_template || "{}",
          response_template: api.response_template || "{}",
        };
      default:
        return baseFields;
    }
  }, [path]);

  // Edit operations
  const handleEditApi = () => {
    if (!selectedApi) {
      toast.error("No API selected");
      return;
    }
    setEditedApi({ ...selectedApi });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedApi(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedApi?.id || !editedApi) {
      toast.error("No API selected or no changes to save");
      return;
    }

    const loadingToast = toast.loading("Updating API...");
    try {
      const response = await api.patch(
        `/services/configure/${path}/${selectedApi.id}/`,
        editedApi
      );

      setApis(prev => prev.map(api => 
        api.id === selectedApi.id ? response.data : api
      ));
      setSelectedApi(response.data);
      setIsEditing(false);
      setEditedApi(null);

      toast.update(loadingToast, {
        render: "API updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: error.message || "Failed to update API",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleApiFieldChange = (field, value) => {
    setEditedApi(prev => ({ ...prev, [field]: value }));
  };

  // Plan management
  const handleAddNewPlan = () => {
    setNewPlans(prev => [
      ...prev,
      { name: "", plan_id: "", price: "", description: "", status: "active" },
    ]);
  };

  const handleRemoveNewPlan = (index) => {
    setNewPlans(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewPlanChange = (index, field, value) => {
    setNewPlans(prev =>
      prev.map((plan, i) => (i === index ? { ...plan, [field]: value } : plan))
    );
  };

  const handleCreatePlans = async () => {
    if (!selectedApi?.id) {
      toast.error("No API selected");
      return;
    }

    const loadingToast = toast.loading("Creating plans...");
    try {
      const createdPlans = [];
      for (const plan of newPlans) {
        if (!plan.name || !plan.plan_id || !plan.price) {
          throw new Error("Fill all required fields for each plan");
        }
        const response = await api.post("/services/configure/plans/", {
          ...plan,
          status: "active",
        });
        createdPlans.push(response.data);
      }

      setAvailablePlans(prev => [...prev, ...createdPlans]);
      const existingPlanIds = selectedApi.plans?.map(p => p.id) || [];
      const newPlanIds = [...existingPlanIds, ...createdPlans.map(p => p.id)];

      const apiResponse = await api.put(
        `/services/configure/${path}/${selectedApi.id}/`,
        { plan_ids: newPlanIds }
      );

      setSelectedApi(apiResponse.data);
      setApis(prev => prev.map(api => 
        api.id === selectedApi.id ? apiResponse.data : api
      ));

      toast.update(loadingToast, {
        render: "Plans created and added",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowNewPlanModal(false);
      setNewPlans([{
        name: "", plan_id: "", price: "", description: "", status: "active"
      }]);
    } catch (error) {
      toast.update(loadingToast, {
        render: error.message || "Failed to create plans",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Existing plans management
  const handleOpenAddExistingPlansModal = () => {
    setShowAddExistingPlansModal(true);
    setSelectedExistingPlans(selectedApi?.plan_ids || []);
  };

  const handleAddExistingPlans = async () => {
    if (!selectedApi?.id) {
      toast.error("No API selected");
      return;
    }

    if (selectedExistingPlans.length === 0) {
      toast.error("Select at least one plan");
      return;
    }

    const loadingToast = toast.loading("Adding plans...");
    try {
      const existingPlanIds = selectedApi.plans?.map(p => p.id) || [];
      const newPlanIds = [...existingPlanIds, ...selectedExistingPlans];

      const response = await api.put(
        `/services/configure/${path}/${selectedApi.id}/`,
        { plan_ids: newPlanIds }
      );

      setSelectedApi(response.data);
      setApis(prev => prev.map(api => 
        api.id === selectedApi.id ? response.data : api
      ));

      toast.update(loadingToast, {
        render: "Plans added successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowAddExistingPlansModal(false);
      setSelectedExistingPlans([]);
    } catch (error) {
      toast.update(loadingToast, {
        render: "Failed to add plans",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleExistingPlanToggle = (planId) => {
    setSelectedExistingPlans(prev =>
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSelectAllExisting = () => {
    const allPlanIds = filteredExistingPlans.map(p => p.id);
    setSelectedExistingPlans(prev =>
      prev.length === allPlanIds.length ? [] : allPlanIds
    );
  };

  // Plan editing
  const handleEditPlan = (plan) => {
    setEditPlan(plan);
    setShowEditPlanModal(true);
  };

  const handleSavePlanEdit = async () => {
    if (!editPlan?.id) {
      toast.error("No plan selected");
      return;
    }

    const loadingToast = toast.loading("Updating plan...");
    try {
      const response = await api.put(
        `/services/configure/plans/${editPlan.id}/`,
        editPlan
      );

      setAvailablePlans(prev =>
        prev.map(p => p.id === editPlan.id ? response.data : p)
      );

      if (selectedApi?.plans?.some(p => p.id === editPlan.id)) {
        const updatedPlans = selectedApi.plans.map(p => 
          p.id === editPlan.id ? response.data : p
        );
        setSelectedApi({ ...selectedApi, plans: updatedPlans });
      }

      toast.update(loadingToast, {
        render: "Plan updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowEditPlanModal(false);
      setEditPlan(null);
    } catch (error) {
      toast.update(loadingToast, {
        render: "Failed to update plan",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handlePlanFieldChange = (field, value) => {
    setEditPlan(prev => ({ ...prev, [field]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating API...");
    try {
      // Include all form fields in the payload
      const payload = {
        ...formData,
        status: formData.status || "active",
        request_template: formData.request_template || "{}",
        response_template: formData.response_template || "{}",
        plan_ids: formData.plan_ids || [],
        waec_price: formData.waec_price || "",
        neco_price: formData.neco_price || "",
        secret_key: formData.secret_key || "",
        public_key: formData.public_key || ""
      };

      const response = await api.post(
        `/services/configure/${path}/`,
        payload
      );

      setApis(prev => [...prev, response.data]);
      setSelectedApi(response.data);
      setShowAddModal(false);
      setFormData(initialFormData);

      toast.update(loadingToast, {
        render: "API created",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: error.message || "Failed to create API",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Load more APIs when scrolling
  const handleScroll = useCallback((e) => {
    const element = e.target;
    if (
      !isApiLoading &&
      hasMore &&
      Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50
    ) {
      setPage(prev => prev + 1);
    }
  }, [isApiLoading, hasMore]);

  // Reset pagination when path changes
  useEffect(() => {
    setPage(1);
    setApis([]);
    setHasMore(true);
  }, [path]);

  // Add scroll event listener
  useEffect(() => {
    const apiList = apiListRef.current;
    if (apiList) {
      apiList.addEventListener('scroll', handleScroll);
      return () => apiList.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Helper functions
  const canAcceptPlans = useCallback((path) => {
    return ["cable-recharges", "data-plans"].includes(path);
  }, []);

  const renderFormFields = () => {
    const fields = formFieldsByPath[path] || [];

    return fields.map((field) => {
      if (field === "status") {
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="border p-2 rounded w-full"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        );
      } else if (
        field === "request_template" ||
        field === "response_template"
      ) {
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <textarea
              placeholder={`${field.replace("_", " ")} (JSON)`}
              className="border p-2 rounded w-full h-32"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        );
      } else if (field === "plan_ids") {
        const filteredPlans = getFilteredPlans();
        return (
          <div key={field} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Select Plans
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  // onClick={handleSelectAll}
                  className="text-sm text-[#00613A] hover:underline"
                >
                  {formData.plan_ids.length === getFilteredPlans().length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(true)}
                  className="text-sm text-[#00613A] hover:underline"
                >
                  Add New Plans
                </button>
              </div>
            </div>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search plans..."
                  className="border p-2 rounded w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      id={`plan-${plan.id}`}
                      checked={formData.plan_ids.includes(plan.id)}
                      onChange={() => handlePlanToggle(plan.id)}
                      className="h-4 w-4 text-[#00613A] focus:ring-[#00613A] border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`plan-${plan.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-500">
                        Price: {plan.price}
                      </div>
                      {plan.description && (
                        <div className="text-sm text-gray-500">
                          {plan.description}
                        </div>
                      )}
                    </label>
                  </div>
                ))}
                {filteredPlans.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No plans found
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Selected plans: {formData.plan_ids.length}
            </p>
          </div>
        );
      } else if (field === "waec_price" || field === "neco_price") {
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder={`Enter ${field.replace("_", " ")}`}
              className="border p-2 rounded w-full"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        );
      } else {
        return (
          <div key={field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              type="text"
              placeholder={`Enter ${field.replace("_", " ")}`}
              className="border p-2 rounded w-full"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        );
      }
    });
  };


  // Add scroll event listener
  useEffect(() => {
    const apiList = apiListRef.current;
    if (apiList) {
      apiList.addEventListener('scroll', handleScroll);
      return () => apiList.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex items-center mb-8 px-4 sm:px-0">
        <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-4 text-gray-800 flex-wrap">
          <span
            className="text-gray-500 hover:text-[#00613A] transition-colors duration-200 cursor-pointer"
            onClick={() => setCard(null)}
          >
            Service Management API
          </span>
          <FaChevronRight className="text-gray-400" />
          <span className="text-[#00613A]">{title} Settings</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00613A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading APIs...</p>
          </div>
        </div>
      ) : apis.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No APIs available. Create a new API to get started.</p>
            <button
              className="bg-[#00613A] hover:bg-[#004d2d] transition-colors duration-200 font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
              onClick={() => setShowAddModal(true)}
              disabled={isOperationLoading}
            >
              Add New API <FaPlus />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 px-4 sm:px-0">
          {/* API List - Mobile View */}
          <div className="lg:hidden">
            <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">APIs</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMobileList(!showMobileList)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                    disabled={isOperationLoading}
                  >
                    {showMobileList ? "Hide List" : "Show List"}
                  </button>
                  <button
                    className="bg-[#00613A] hover:bg-[#004d2d] transition-colors duration-200 font-medium text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowAddModal(true)}
                    disabled={isOperationLoading}
                  >
                    Add New API <FaPlus />
                  </button>
                </div>
              </div>

              {selectedApi && (
                <div className="mb-4 p-3 rounded-lg bg-[#00613A] text-white shadow-md">
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-medium mb-2">
                      {selectedApi.url}
                    </span>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={e => handleStatusToggle(selectedApi, e)}
                        disabled={isOperationLoading}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedApi.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isOperationLoading
                          ? "Updating..."
                          : selectedApi.status}
                      </button>
                      <button
                        onClick={e => onDelete(selectedApi.id, e)}
                        disabled={isOperationLoading}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showMobileList && (
                <div
                  className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-3"
                  ref={apiListRef}
                >
                  {apis.map(
                    (api) =>
                      api.id !== selectedApi?.id && (
                        <div
                          key={api.id}
                          className="p-3 rounded-lg cursor-pointer transition-all duration-200 flex-shrink-0 w-[280px] bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          onClick={() => handleApiSelect(api)}
                        >
                          <div className="flex flex-col">
                            <span className="truncate text-sm font-medium mb-2">
                              {api.url}
                            </span>
                            <div className="flex justify-between items-center">
                              <button
                                onClick={(e) => handleStatusToggle(api, e)}
                                disabled={isOperationLoading}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  api.status === "active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {isOperationLoading
                                  ? "Updating..."
                                  : api.status}
                              </button>
                              <button
                                onClick={(e) => onDelete(api.id, e)}
                                disabled={isOperationLoading}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* API List - Desktop View */}
          <div className="hidden lg:block w-1/3">
            <div className="bg-white shadow-lg rounded-xl p-6 h-full flex flex-col border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">APIs</h2>
                <button
                  className="bg-[#00613A] hover:bg-[#004d2d] transition-colors duration-200 font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowAddModal(true)}
                  disabled={isOperationLoading}
                >
                  Add New API <FaPlus />
                </button>
              </div>
              {isApiLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00613A] mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading APIs...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                  {apis.map(api => (
                    <div
                      key={api.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedApi?.id === api.id
                          ? "bg-[#00613A] text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() => handleApiSelect(api)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <span className="truncate block text-sm font-medium">
                            {api.url}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleStatusToggle(api, e);
                            }}
                            disabled={isOperationLoading}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              api.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isOperationLoading ? "Updating..." : api.status}
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onDelete(api.id, e);
                            }}
                            disabled={isOperationLoading}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* API Details and Plans */}
          <div className="w-full lg:w-2/3">
            {selectedApi ? (
              <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-100">
                {isOperationLoading ? (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00613A] mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Updating API...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        API Details
                      </h2>
                      {!isEditing ? (
                        <button
                          onClick={handleEditApi}
                          disabled={isOperationLoading}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaEdit /> Edit API
                        </button>
                      ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={handleCancelEdit}
                            disabled={isOperationLoading}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isOperationLoading}
                            className="px-4 py-2 rounded-lg bg-[#00613A] text-white hover:bg-[#004d2d] transition-colors duration-200 flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          URL
                        </label>
                        <input
                          type="text"
                          value={isEditing ? editedApi.url : selectedApi.url}
                          onChange={(e) =>
                            isEditing &&
                            handleApiFieldChange("url", e.target.value)
                          }
                          className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                            isEditing
                              ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                              : "bg-gray-50 text-gray-600"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          API Key
                        </label>
                        <input
                          type="text"
                          value={
                            isEditing ? editedApi.api_key : selectedApi.api_key
                          }
                          onChange={(e) =>
                            isEditing &&
                            handleApiFieldChange("api_key", e.target.value)
                          }
                          className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                            isEditing
                              ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                              : "bg-gray-50 text-gray-600"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        {isEditing ? (
                          <select
                            value={editedApi.status}
                            onChange={(e) =>
                              handleApiFieldChange("status", e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={selectedApi.status}
                            className="mt-1 block w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 text-gray-600"
                            disabled
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Secret Key
                        </label>
                        <input
                          type="text"
                          value={
                            isEditing
                              ? editedApi.secret_key
                              : selectedApi.secret_key
                          }
                          onChange={(e) =>
                            isEditing &&
                            handleApiFieldChange("secret_key", e.target.value)
                          }
                          className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                            isEditing
                              ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                              : "bg-gray-50 text-gray-600"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Public Key
                        </label>
                        <input
                          type="text"
                          value={
                            isEditing
                              ? editedApi.public_key
                              : selectedApi.public_key
                          }
                          onChange={(e) =>
                            isEditing &&
                            handleApiFieldChange("public_key", e.target.value)
                          }
                          className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                            isEditing
                              ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                              : "bg-gray-50 text-gray-600"
                          }`}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {canAcceptPlans(path) ? (
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Plans
                          </h2>
                          <div className="flex gap-2">
                            <button
                              onClick={handleOpenAddExistingPlansModal}
                              className="px-4 py-2 rounded-lg border border-[#00613A] text-[#00613A] hover:bg-[#00613A] hover:text-white transition-colors duration-200 font-medium flex items-center gap-2"
                            >
                              <FaPlus /> Add Existing Plans
                            </button>
                            <button
                              onClick={() => setShowNewPlanModal(true)}
                              className="bg-[#00613A] hover:bg-[#004d2d] transition-colors duration-200 font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
                            >
                              <FaPlus /> Create New Plans
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedApi.plans && selectedApi.plans.length > 0 ? (
                            selectedApi.plans.map(plan => (
                              <div
                                key={plan.id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#00613A] transition-colors duration-200"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h3 className="font-medium text-gray-900">
                                      {plan.name}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-500">
                                          Plan ID:
                                        </span>
                                        <span className="ml-2 text-gray-700">
                                          {plan.plan_id}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">
                                          Price:
                                        </span>
                                        <span className="ml-2 text-gray-700">
                                          {plan.price}
                                        </span>
                                      </div>
                                      {plan.description && (
                                        <div className="col-span-1 sm:col-span-2">
                                          <span className="text-gray-500">
                                            Description:
                                          </span>
                                          <span className="ml-2 text-gray-700">
                                            {plan.description}
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        <span className="text-gray-500">
                                          Status:
                                        </span>
                                        <span
                                          className={`ml-2 ${
                                            plan.status === "active"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {plan.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleEditPlan(plan)}
                                    className="text-gray-400 hover:text-[#00613A] transition-colors duration-200"
                                  >
                                    <FaEdit />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-gray-500">
                                No plans available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                          API Parameters
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                          {path === "education" && (
                            <>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  WAEC Price
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={
                                    isEditing
                                      ? editedApi.waec_price
                                      : selectedApi.waec_price
                                  }
                                  onChange={(e) =>
                                    isEditing &&
                                    handleApiFieldChange(
                                      "waec_price",
                                      e.target.value
                                    )
                                  }
                                  className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                                    isEditing
                                      ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                                      : "bg-gray-50 text-gray-600"
                                  }`}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  NECO Price
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={
                                    isEditing
                                      ? editedApi.neco_price
                                      : selectedApi.neco_price
                                  }
                                  onChange={(e) =>
                                    isEditing &&
                                    handleApiFieldChange(
                                      "neco_price",
                                      e.target.value
                                    )
                                  }
                                  className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 ${
                                    isEditing
                                      ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                                      : "bg-gray-50 text-gray-600"
                                  }`}
                                  disabled={!isEditing}
                                />
                              </div>
                            </>
                          )}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Request Template
                            </label>
                            <textarea
                              value={
                                isEditing
                                  ? typeof editedApi.request_template ===
                                    "object"
                                    ? JSON.stringify(
                                        editedApi.request_template,
                                        null,
                                        2
                                      )
                                    : editedApi.request_template
                                  : typeof selectedApi.request_template ===
                                    "object"
                                  ? JSON.stringify(
                                      selectedApi.request_template,
                                      null,
                                      2
                                    )
                                  : selectedApi.request_template
                              }
                              onChange={(e) => {
                                try {
                                  const parsedValue = JSON.parse(
                                    e.target.value
                                  );
                                  handleApiFieldChange(
                                    "request_template",
                                    parsedValue
                                  );
                                } catch {
                                  handleApiFieldChange(
                                    "request_template",
                                    e.target.value
                                  );
                                }
                              }}
                              className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 h-32 font-mono text-sm ${
                                isEditing
                                  ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                                  : "bg-gray-50 text-gray-600"
                              }`}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Response Template
                            </label>
                            <textarea
                              value={
                                isEditing
                                  ? typeof editedApi.response_template ===
                                    "object"
                                    ? JSON.stringify(
                                        editedApi.response_template,
                                        null,
                                        2
                                      )
                                    : editedApi.response_template
                                  : typeof selectedApi.response_template ===
                                    "object"
                                  ? JSON.stringify(
                                      selectedApi.response_template,
                                      null,
                                      2
                                    )
                                  : selectedApi.response_template
                              }
                              onChange={(e) => {
                                try {
                                  const parsedValue = JSON.parse(
                                    e.target.value
                                  );
                                  handleApiFieldChange(
                                    "response_template",
                                    parsedValue
                                  );
                                } catch {
                                  handleApiFieldChange(
                                    "response_template",
                                    e.target.value
                                  );
                                }
                              }}
                              className={`mt-1 block w-full border border-gray-200 rounded-lg p-2.5 h-32 font-mono text-sm ${
                                isEditing
                                  ? "bg-white focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none"
                                  : "bg-gray-50 text-gray-600"
                              }`}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex items-center justify-center h-full">
                <p className="text-gray-500">Select an API to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h2 className="text-base font-medium">Add New API</h2>
            </div>

            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {renderFormFields()}
              </form>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-3 py-1.5 text-sm bg-[#00613A] text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewPlanModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowNewPlanModal(false);
            setNewPlans([
              {
                name: "",
                plan_id: "",
                price: "",
                description: "",
                status: "active",
              },
            ]);
          }}
        >
          <div
            className="bg-white rounded-lg w-[500px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h2 className="text-base font-medium">Add New Plans</h2>
            </div>

            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {newPlans.map((plan, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Plan {index + 1}</h3>
                    {newPlans.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveNewPlan(index)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Name</label>
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => handleNewPlanChange(index, "name", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Enter plan name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Plan ID</label>
                      <input
                        type="text"
                        value={plan.plan_id}
                        onChange={(e) => handleNewPlanChange(index, "plan_id", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Enter plan ID"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Price</label>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => handleNewPlanChange(index, "price", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-0.5">Description</label>
                      <input
                        type="text"
                        value={plan.description}
                        onChange={(e) => handleNewPlanChange(index, "description", e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleAddNewPlan}
                  className="text-[#00613A] text-xs font-medium"
                >
                  + Add Another Plan
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPlanModal(false);
                      setNewPlans([
                        {
                          name: "",
                          plan_id: "",
                          price: "",
                          description: "",
                          status: "active",
                        },
                      ]);
                    }}
                    className="px-2.5 py-1 text-xs border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePlans}
                    className="px-2.5 py-1 text-xs bg-[#00613A] text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditPlanModal && editPlan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowEditPlanModal(false);
            setEditPlan(null);
          }}
        >
          <div
            className="bg-white p-8 rounded-xl w-[90%] max-w-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Plan
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editPlan.name}
                    onChange={(e) =>
                      handlePlanFieldChange("name", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan ID *
                  </label>
                  <input
                    type="text"
                    value={editPlan.plan_id}
                    onChange={(e) =>
                      handlePlanFieldChange("plan_id", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                    placeholder="Enter plan ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPlan.price}
                    onChange={(e) =>
                      handlePlanFieldChange("price", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editPlan.description || ""}
                    onChange={(e) =>
                      handlePlanFieldChange("description", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editPlan.status}
                    onChange={(e) =>
                      handlePlanFieldChange("status", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditPlanModal(false);
                  setEditPlan(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlanEdit}
                className="px-4 py-2 rounded-lg bg-[#00613A] text-white hover:bg-[#004d2d] transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddExistingPlansModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowAddExistingPlansModal(false);
            setSelectedExistingPlans([]);
            setExistingPlansSearchTerm("");
            setShowAllPlans(false);
          }}
        >
          <div
            className="bg-white p-8 rounded-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Add Existing Plans to {selectedApi?.url}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search plans..."
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:border-[#00613A] focus:ring-1 focus:ring-[#00613A] outline-none transition-colors duration-200"
                    value={existingPlansSearchTerm}
                    onChange={e => setExistingPlansSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAllPlans(!showAllPlans)}
                    className={`px-3 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                      showAllPlans
                        ? "border-[#00613A] text-[#00613A] hover:bg-[#00613A] hover:text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {showAllPlans ? "Show Filtered Plans" : "Show All Plans"}
                  </button>
                  <button
                    onClick={handleSelectAllExisting}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    {selectedExistingPlans.length ===
                    getFilteredExistingPlans().length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
              </div>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getFilteredExistingPlans().map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`existing-plan-${plan.id}`}
                        checked={selectedExistingPlans.includes(plan.id)}
                        onChange={() => handleExistingPlanToggle(plan.id)}
                        className="h-4 w-4 text-[#00613A] focus:ring-[#00613A] border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`existing-plan-${plan.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500">
                          Price: {plan.price}
                        </div>
                        {plan.description && (
                          <div className="text-sm text-gray-500">
                            {plan.description}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                  {getFilteredExistingPlans().length === 0 && (
                    <div className="text-center text-gray-500 py-4">No plans found</div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">Selected plans: {selectedExistingPlans.length}</p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddExistingPlansModal(false);
                  setSelectedExistingPlans([]);
                  setExistingPlansSearchTerm("");
                  setShowAllPlans(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExistingPlans}
                className="px-4 py-2 rounded-lg bg-[#00613A] text-white hover:bg-[#004d2d] transition-colors duration-200"
              >
                Add Selected Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDetails;