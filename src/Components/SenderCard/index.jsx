import React from "react";
import "./senderCard.css";
import moment from "moment";
import { IoAttach } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import useDownloader from "react-use-downloader";
const SenderCard = ({ message, image, fromName, toName, time }) => {
  const { download } = useDownloader();
  const imageRegex = /\.((?:jpg|jpeg|png|gif|bmp|svg|webp|tiff))\b/;
  const regexFile =
    /\.((?:pdf|docx?|xlsx?|pptx?|txt|rtf|csv|html?|xml|json|odt|ods|odp|ott|ots|otp|odg|epub|md|tex|pages))\b/;
  const handleDownload = async (message, fileName) => {
    console.log(message.split("?")[0].split("#")[0].split(".").pop());
    download(
      message,
      fileName + "." + message.split("?")[0].split("#")[0].split(".").pop()
    );
  };
  return (
    <div className="total-sender-card">
      <img src={image} referrerPolicy="no-referrer" alt="avatar" />
      <div className="sender-card-top">
        <div className="sender-chat">
          <h4>
            {fromName} <span>to {toName}</span>
          </h4>
          {imageRegex.test(message) ? (
            <div className="image-view">
              <img src={message} alt="image" />
              <span>
                <IoMdDownload
                  onClick={() => {
                    handleDownload(message, "image");
                  }}
                />
              </span>
            </div>
          ) : regexFile.test(message) ? (
            <div className="doc-preview">
              <span>
                <IoAttach />
              </span>
              <p className="download-button">
                <IoMdDownload
                  onClick={() => {
                    handleDownload(message, "document");
                  }}
                />
              </p>
            </div>
          ) : (
            <p>{message}</p>
          )}
          {/* <p>{message}</p> */}
        </div>
        <p>
          {moment(time.toDate()).format("LT")} /{" "}
          {moment(time.toDate()).format("YYYY.MM.DD")}
        </p>
      </div>
    </div>
  );
};

export default SenderCard;
