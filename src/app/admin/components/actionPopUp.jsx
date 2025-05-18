import api from "@/utils/api";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
const ActionPopUp = ({ optionList, setActionItem, onClose, userId }) => {
  console.log("the user Id", userId);

  const ApproveKYC = async (item) => {
    setActionItem(item);
    const loadingToast = toast.loading("Processing Request...");
    try {
      const res = await api.put(`/users/kyc/approve/${userId}/`, {
        approved: item === "Approved" ? true : false,
      });
      toast.update(loadingToast, {
        render: "KYC Request Submitted",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      console.log("KYC aproval  response", res);
      onClose();
    } catch (err) {
      console.log("the error",err);
      toast.update(loadingToast, {
        render: `Fetch error: ${err.response.data.details}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      onClose();

    }
  };

  return (
    <div className="bg-white  z-30 text-black shadow-md rounded-2xl absolute top-[80%] right-[-10%]">
     
      <ul className="flex flex-col items-center">
        {optionList?.map((item) => (
          <li
            className="border-b w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => ApproveKYC(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionPopUp;
