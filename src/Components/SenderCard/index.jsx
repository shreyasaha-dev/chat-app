import React from "react";
import "./senderCard.css";
const SenderCard = () => {
  return (
    <div className="total-sender-card">
      <img
        src={require("../../images/no-profile-picture-15257.png")}
        alt="avatar"
      />
      <div className="sender-card-top">
        <div className="sender-chat">
          <h4>
            Pete Martelll <span>to Kate Walkar</span>
          </h4>
          <p>
            I do not think you could find a mammoth.They have long been extinct.
          </p>
        </div>
        <p>12:09 AM/2017.04.15</p>
      </div>
    </div>
  );
};

export default SenderCard;
