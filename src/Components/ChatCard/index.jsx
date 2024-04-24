import React from "react";
import "./chatCard.css";
const ChatCard = ({ image, name }) => {
  return (
    <div className="total-card">
      <img src={image} alt="avatar" />
      <div className="card-right-section">
        <h4>
          {name} <span>14 apr</span>
        </h4>
        <p>As if to say,you know if...</p>
      </div>
    </div>
  );
};

export default ChatCard;
