import React from "react";
const ActionPopUp = ({ optionList, setActionItem, onClose }) => {
  return (
    <div className="bg-white z-10 text-black shadow-md rounded-2xl absolute top-[80%] right-[-10%]">
      <ul className="flex flex-col items-center">
        {optionList?.map((item) => (
          <li
            className="border-b w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setActionItem(item);
              onClose();
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionPopUp;

//  <li className="border-b w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer">
//           Approved
//         </li>
//         <li className="border-b w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer">
//           Not Approved
//         </li>
//         <li className="w-full text-center px-[4em] py-4 hover:bg-gray-200 cursor-pointer">
//           Processing
//         </li>
