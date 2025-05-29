import { data } from "autoprefixer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleBillsConfirm = async (pin, dataa, url, setIsLoading) => {
  console.log("Entered PIN:", pin);
  // setTransactionPin(pin);
  // setIsPinModalOpen(false);

  // Make the API request with the entered PIN
  setIsLoading(true);
  const loadingToast = toast.loading("Processing payment...");
  
  try {
    console.log("my data", dataa);
    const response = await fetch(
      `http://localhost:8000/services/${url}`,
      // "http://localhost:8000/services/airtime-topups-transactions/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Transaction-PIN": pin,
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(dataa),
      }
    );
    const data = await response.json();
    console.log("API Response:", data);

    if (response.ok) {
      toast.dismiss(loadingToast);
      toast.success("Payment processed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return data; 
    } else {
      // Handle array of error messages
      const errorMessage = Array.isArray(data) ? data[0] : (data.detail || "Failed to process payment");
      toast.dismiss(loadingToast);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("Payment error:", err);
    const errorMessage = err || "An error occurred while processing payment";
    toast.dismiss(loadingToast);
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setIsLoading(false);
    throw err;
  }
};
