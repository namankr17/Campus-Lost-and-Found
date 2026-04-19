import React from "react";
import { IoClose } from "react-icons/io5";

function ImageModal({ image, onClose }) {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <IoClose />
        </button>
        <img src={image} alt="Enlarged view" />
      </div>
    </div>
  );
}

export default ImageModal;
