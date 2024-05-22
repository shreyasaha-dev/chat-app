import React, { useEffect, useState } from "react";
import "./chatCard.css";
import { useSelector } from "react-redux";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../utils/firebase.utils";
import moment from "moment";

const ChatCard = ({ image, name, clickedUser, uid }) => {
  const meData = useSelector((state) => state.meData);
  const selectedUser = useSelector((state) => state.selectedUser);
  const [showLastMessage, setShowLastMessage] = useState();
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "lastMessages", [meData.uid, uid].sort().join("")),
      (doc) => {
        console.log("Current data: ", doc.data());
        setShowLastMessage(doc.data());
      }
    );

    return () => unsubscribe();
  }, []);
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
          {name}{" "}
          <span>
            {moment(showLastMessage?.createdAt?.toDate()).format("DD  MMM")}
          </span>
        </h4>
        <p>{showLastMessage?.message}</p>
      </div>
    </div>
  );
};

export default ChatCard;
