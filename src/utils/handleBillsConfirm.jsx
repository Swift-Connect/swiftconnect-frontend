import { data } from "autoprefixer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleBillsConfirm = async (pin, dataa, url, setIsLoading) => {
  // setTransactionPin(pin);
  // setIsPinModalOpen(false);

  // Make the API request with the entered PIN
  setIsLoading(true);
  const loadingToast = toast.loading("Processing payment...");
  
  try {
    console.log("my data", dataa);
    const response = await fetch(
      `http://127.0.0.1:8000/services/${url}`,
      // "http://127.0.0.1:8000/services/airtime-topups-transactions/",
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
    console.log("api response:::::", response)
    const data = await response.json();
    console.log("API Response:", data);

    if (response.ok) {
      console.log('response okay...')
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
      console.log('response not okay')
      let errorMessage;
      
      if (typeof data === 'object') {
        // Handle validation errors like {"plan_id":["A valid integer is required."]}
        const fieldErrors = Object.entries(data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages[0] : messages}`)
          .join('\n');
        errorMessage = fieldErrors || data.detail || "Failed to process payment";
      } else if (Array.isArray(data)) {
        errorMessage = data[0];
      } else {
        errorMessage = data.detail || "Failed to process payment";
      }

      toast.dismiss(loadingToast);
      // toast.error(errorMessage, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("Payment error:", err);
    let errorMessage = "An error occurred while processing payment";
    
    if (err.response?.data) {
      if (typeof err.response.data === 'object') {
        const fieldErrors = Object.entries(err.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages[0] : messages}`)
          .join('\n');
        errorMessage = fieldErrors || err.response.data.detail || errorMessage;
      } else if (Array.isArray(err.response.data)) {
        errorMessage = err.response.data[0];
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

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
