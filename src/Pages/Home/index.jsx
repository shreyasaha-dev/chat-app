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
import { db, storage } from "../../utils/firebase.utils";
import { ImCross } from "react-icons/im";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { storeUserData } from "../../store/Reducer/userDataReducer";
import {
  resetSelectedUser,
  storeSelectedDetails,
  storeSelectedUid,
} from "../../store/Reducer/selectedUserReducer";
import Picker from "emoji-picker-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
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
  const [allMessages, setAllMessages] = useState([]);
  // getting all logged in users(without me data) from firestore to show it in the side bar
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
  // store selected user uid to fetch details
  const clickedUser = (uid) => {
    dispatch(storeSelectedUid(uid));
  };
  // fetch details of the selected user from firestore
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
    setImage("");
  };
  const imageUpload = () => {
    inputImage.current.click();
  };
  function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
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
    setDocument("");
  };
  const docUpload = () => {
    inputDoc.current.click();
  };
  // send message
  const messageSend = async () => {
    // sending text message
    const timeStamp = Timestamp.fromDate(new Date());
    if (!image && !document) {
      await addDoc(
        collection(
          db,
          "messages",
          [meData.uid, selectedUser.uid].sort().join(""),
          "chat"
        ),
        {
          message: inputValue,
          from: meData.uid,
          to: selectedUser.uid,
          createdAt: timeStamp,
          id: uuidv4(),
        }
      );
      await setDoc(
        doc(
          collection(db, "lastMessages"),
          [meData.uid, selectedUser.uid].sort().join("")
        ),
        {
          message: inputValue,
          from: meData.uid,
          to: selectedUser.uid,
          createdAt: timeStamp,
          id: uuidv4(),
        }
      );
      setInputValue("");
    }
    // sending file to firebase storage and make a download url from the storage snapshot
    else {
      try {
        const storageRef = ref(
          storage,
          image
            ? `files/${uuidv4()}-${image.name}`
            : `files/${uuidv4()}-${document.name}`
        );
        const snapshot = await uploadBytes(storageRef, image || document);
        const response = await getDownloadURL(snapshot.ref);
        // sending the download url to firestore
        await addDoc(
          collection(
            db,
            "messages",
            [meData.uid, selectedUser.uid].sort().join(""),
            "chat"
          ),
          {
            message: response,
            from: meData.uid,
            to: selectedUser.uid,
            createdAt: timeStamp,
            id: uuidv4(),
          }
        );
        await setDoc(
          doc(
            collection(db, "lastMessages"),
            [meData.uid, selectedUser.uid].sort().join("")
          ),
          {
            message: image ? "📷 Image" : "📄 Document",
            from: meData.uid,
            to: selectedUser.uid,
            createdAt: timeStamp,
            id: uuidv4(),
          }
        );
        setImage("");
        setPreviewImage("");
        setDocument("");
      } catch (err) {
        console.log(err);
      }
    }
  };
  // fetching all messages of a selected user and store it in a usestate to show
  useEffect(() => {
    const messagesRef = collection(
      db,
      "messages",
      [meData.uid, selectedUser.uid].sort().join(""),
      "chat"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const message = [];
        snapshot.forEach((doc) => {
          message.push(doc.data());
        });
        setAllMessages(message);
        console.log(message);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );
    return () => unsubscribe();
  }, [meData.uid, selectedUser.uid]);
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef && containerRef.current) {
      const element = containerRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [containerRef, allMessages]);
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
          {/* <button className="button">+</button> */}
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
          {allUserData?.map((item, i) => {
            return (
              <ChatCard
                image={item?.photoURL}
                key={i}
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
            <div className="middle-right-section" ref={containerRef}>
              {allMessages.map((item) => {
                if (item.from === meData.uid) {
                  return (
                    <ReceiverCard
                      message={item?.message}
                      image={meData?.photoURL}
                      fromName={meData?.displayName}
                      toName={selectedUser?.details?.displayName}
                      key={item.id}
                      time={item?.createdAt}
                    />
                  );
                } else {
                  return (
                    <SenderCard
                      key={item.id}
                      message={item?.message}
                      image={selectedUser?.details?.photoURL}
                      fromName={selectedUser?.details?.displayName}
                      toName={meData?.displayName}
                      time={item?.createdAt}
                    />
                  );
                }
              })}
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
                  value=""
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
                  value=""
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
                {document && (
                  <div className="image-preview file">
                    <span>
                      <IoAttach />
                    </span>
                    <p>{document?.name}</p>
                    <button
                      onClick={() => {
                        setDocument("");
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
