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
      url,
      // "https://swiftconnect-backend.onrender.com/services/airtime-topups-transactions/",
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
    console.log(data);

    if (response.ok) {
      toast.update(loadingToast, {
        render: "Payment processed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      // window.location.href = data.payment_link;
    } else {
      console.log(data);

      toast.update(loadingToast, {
        render: data[0] || "Failed to process payment",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
    console.log(data);
  } catch (err) {
    toast.update(loadingToast, {
      render: "Fetch error: " + err.message,
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    console.error("Fetch error:", err);
  } finally {
    setIsLoading(false);
  }
};
