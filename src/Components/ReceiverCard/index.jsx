import React from "react";
import "./receiverCard.css";
const ReceiverCard = () => {
  return (
    <div className="total-receiver-card">
      <div className="receiver-top-section">
        <div className="receiver-left-section">
          <h4>
            Misha Kazancev <span>to Kate Martell</span>
          </h4>
          <p>I think she can.</p>
        </div>

        <p>12.09 AM / 2017.04.15 / Delivered</p>
      </div>
      <img
        src={require("../../images/no-profile-picture-15257.png")}
        alt="avatar"
      />
    </div>
  );
};

export default ReceiverCard;
