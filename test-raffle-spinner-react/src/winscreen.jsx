// import React, { useState } from 'react';
import Modal from 'react-modal';

// Make sure to set appElement to handle accessibility
Modal.setAppElement('#root');

const Winscreen = ({ isOpen, closeModal, modalText, remove }) => {
  const customStyles = {
    content: {
      width: '50%', // Set the width to your desired value
      margin: 'auto', // Center the modal horizontally
      maxHeight: '35%', // Set the maximum height to avoid taking up the entire viewport
      overflow: 'none', // Enable vertical scrolling if needed
      backgroundColor: 'rgba(250, 229, 175, 1)',
      Zindex: 2,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      contentLabel="win-screen"
      style={customStyles}
    >
      <div className="modal">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="modal-content">
          <img className="modal_logo" id="modal_left" src={require('./img/kwibs_modal.png')} alt="modal_left"/>
          <p className="winner">{modalText}</p>
          <img className="modal_logo" id="modal_right" src={require('./img/kwibs_modal.png')} alt="modal_right"/>
        </div>
        <div className="ok">
          <button className="winButton" onClick={remove}>Okay</button>
        </div>
        {/* <button className="winButton" onClick={remove}>Okay</button> */}
      </div>
      
    </Modal>
  );
};

export default Winscreen;