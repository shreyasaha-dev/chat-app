import React from "react";
import "./chatCard.css";
import { useSelector } from "react-redux";
const ChatCard = ({ image, name, clickedUser, uid }) => {
  const selectedUser = useSelector((state) => state.selectedUser);
  return (
    <div
      className={
        uid === selectedUser.uid ? "total-card selected" : "total-card"
      }
      onClick={clickedUser}
    >
      <img src={image} alt="avatar" referrerPolicy="no-referrer" />
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
