import axios from "axios";
import React, { useState } from "react";
import baseUrl from "../../../helpers/baseUrl";

const MyRequestsModal = ({ show, handleClose, myRequests }) => {

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white w-[700px] p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Requests</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        {
          myRequests.slice(0,5).map((mr,index) => (
            <div className="my-2" key={mr.id}> {/* Assuming mr.id is unique for each request */}
              <div className="shadow-md flex justify-between items-center rounded-md bg-blue-50">
                <p className="text-lg p-3"> {index+1}) 
                   <span className="text-green-500"> { mr.senderId.fullName} </span>
                  Request <span className="text-orange-500">{mr.receiverId.fullName} </span> to {mr.type} <span className="text-red-500"> {mr.amount} ৳</span>
                </p>
                <div className="flex mr-2 gap-3">
                  <p className={`px-2 py-1 rounded-md text-lg ${mr.isDecline ? 'text-red-500' :
                      mr.isApprove ? 'text-green-500' :
                        'text-orange-500 bg-orange-100'
                    }`}>
                    {mr.isApprove ?
                      (mr.isDecline ? "Declined" : "Accepted") :
                      "Pending"}
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MyRequestsModal;
