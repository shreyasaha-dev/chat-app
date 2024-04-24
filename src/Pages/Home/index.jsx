import React, { useEffect, useState } from "react";
import ChatCard from "../../Components/ChatCard";
import "./home.css";
import { IoCamera } from "react-icons/io5";
import { IoAttach } from "react-icons/io5";
import { FaSmile } from "react-icons/fa";
import { MdOutlineAddIcCall } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import SenderCard from "../../Components/SenderCard";
import ReceiverCard from "../../Components/ReceiverCard";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CallerModal from "../../Components/CallerModal";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { resetMeData, storeMeData } from "../../store/Reducer/meDataReducer";
import { db } from "../../utils/firebase.utils";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { storeUserData } from "../../store/Reducer/userDataReducer";
const Home = () => {
  const meData = useSelector((state) => state.meData);
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("uid", "not-in", [meData.uid])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users);
      dispatch(storeUserData(users));
    });

    return () => unsubscribe();
  }, [meData.uid]);
  return (
    <div className="total-home">
      <div className="home-left-section">
        <div className="top-left-section">
          <input placeholder="Search" />
          <button className="button">+</button>
          <button
            className="logOut"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Log out",
              }).then((result) => {
                if (result.isConfirmed) {
                  dispatch(resetMeData());
                }
              });
            }}
          >
            Log Out
          </button>
        </div>
        <div className="top-bottom-section">
          {userData.map((item) => {
            return <ChatCard image={item.photoURL} name={item.displayName} />;
          })}
        </div>
      </div>
      <div className="home-right-section">
        <div className="top-right-section">
          <h4>Collective chat</h4>
          <button onClick={onOpenModal}>
            <MdOutlineAddIcCall />
          </button>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            closeOnOverlayClick={false}
            classNames={{
              modal: "customModal",
            }}
          >
            <CallerModal close={onCloseModal} />
          </Modal>
        </div>
        <div className="middle-right-section">
          <SenderCard />
          <ReceiverCard />
          <SenderCard />
          <SenderCard />
          <ReceiverCard />
          <SenderCard />
        </div>
        <div className="bottom-right-section">
          <div className="input-card">
            <input placeholder="Enter message" />
            <button style={{ fontSize: "23px" }}>
              <IoCamera />
            </button>
            <button style={{ fontSize: "25px" }}>
              <IoAttach />
            </button>
            <button>
              <FaSmile />
            </button>
          </div>
          <button>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
