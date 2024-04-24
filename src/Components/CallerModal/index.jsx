import React from "react";
import { IoCall } from "react-icons/io5";
import "./callerModal.css";
const CallerModal = ({ close }) => {
  return (
    <div className="total-modal">
      <h2>12:10</h2>
      <img
        src={require("../../images/no-profile-picture-15257.png")}
        alt="avatar"
      />
      <button onClick={close}>
        End Call
        <span>
          <IoCall />
        </span>
      </button>
    </div>
  );
};

export default CallerModal;
