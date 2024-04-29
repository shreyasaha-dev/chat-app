import React, { useEffect, useRef, useState } from "react";
import ChatCard from "../../Components/ChatCard";
import "./home.css";
import { MdInsertPhoto } from "react-icons/md";
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
import { ImCross } from "react-icons/im";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { storeUserData } from "../../store/Reducer/userDataReducer";
import {
  resetSelectedUser,
  storeSelectedDetails,
  storeSelectedUid,
} from "../../store/Reducer/selectedUserReducer";
import Picker from "emoji-picker-react";
const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const userData = useSelector((state) => state.userData);
  const [allUserData, setAllUserData] = useState(userData);
  const meData = useSelector((state) => state.meData);
  const selectedUser = useSelector((state) => state.selectedUser);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const inputImage = useRef(null);
  const [document, setDocument] = useState("");
  const inputDoc = useRef(null);
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

  useEffect(() => {
    if (searchValue !== "") {
      setAllUserData(
        userData?.filter((item) => {
          if (
            item.displayName.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return item;
          }
        })
      );
    } else {
      setAllUserData(userData);
    }
  }, [searchValue, userData]);
  const clickedUser = (uid) => {
    dispatch(storeSelectedUid(uid));
  };
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", selectedUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      dispatch(storeSelectedDetails(users[0]));
    });

    return () => unsubscribe();
  }, [selectedUser.uid]);
  const onEmojiClick = (event) => {
    setInputValue((prevInput) => prevInput + event.emoji);
  };
  const handleFileUpload = (e) => {
    const { files } = e.target;
    setDocument(files[0]);
  };
  const imageUpload = () => {
    inputImage.current.click();
  };
  function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      setPreviewImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  const handleImageUpload = (e) => {
    const { files } = e.target;
    setImage(files[0]);
    getBase64(files[0]);
    // setPreviewImage();
  };
  const docUpload = () => {
    inputDoc.current.click();
  };
  const messageSend = async () => {
    await addDoc(
      collection(db, "messages", meData.uid + selectedUser.uid, "chat"),
      {
        message: inputValue,
        from: meData.uid,
        to: selectedUser.uid,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );
    setInputValue("");
  };
  return (
    <div className="total-home">
      <div className="home-left-section">
        <div className="top-left-section">
          <input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
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
                  dispatch(resetSelectedUser());
                }
              });
            }}
          >
            Log Out
          </button>
        </div>
        <div className="top-bottom-section">
          {allUserData?.map((item) => {
            return (
              <ChatCard
                image={item?.photoURL}
                name={item?.displayName}
                uid={item?.uid}
                clickedUser={() => {
                  clickedUser(item?.uid);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="home-right-section">
        {selectedUser.uid ? (
          <>
            <div className="top-right-section">
              <h4>{selectedUser?.details?.displayName}</h4>
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
                <input
                  placeholder="Enter message"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
                <input
                  style={{ display: "none" }}
                  ref={inputImage}
                  onChange={handleImageUpload}
                  type="file"
                  accept=".png, .jpg, .jpeg"
                />
                <button style={{ fontSize: "24px" }} onClick={imageUpload}>
                  <MdInsertPhoto />
                </button>
                <input
                  style={{ display: "none" }}
                  ref={inputDoc}
                  onChange={handleFileUpload}
                  type="file"
                  accept=".doc,.docx,.xml,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <button style={{ fontSize: "25px" }} onClick={docUpload}>
                  <IoAttach />
                </button>
                <button onClick={() => setShowPicker(!showPicker)}>
                  <FaSmile />
                </button>
                {image && (
                  <div className="image-preview">
                    <img src={previewImage} alt="" />
                    <button
                      onClick={() => {
                        setImage("");
                        setPreviewImage("");
                      }}
                    >
                      <ImCross />
                    </button>
                  </div>
                )}
                {showPicker && (
                  <Picker
                    // open={true}
                    // autoFocusSearch={false}
                    width="100%"
                    style={{
                      position: "absolute",
                      right: "0",
                      bottom: "55px",
                      zIndex: 1,
                    }}
                    onEmojiClick={onEmojiClick}
                  />
                )}
              </div>
              <button onClick={messageSend}>
                <IoIosSend />
              </button>
            </div>
          </>
        ) : (
          <div className="total-right-section">
            <h2>Select a friend to chat</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
