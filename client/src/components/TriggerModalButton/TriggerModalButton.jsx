import React from 'react'

function TriggerModalButton({buttonText, buttonRef, showModal}) {

    return (
        <button className="user-profile__update" ref={buttonRef} onClick={showModal}> {buttonText} </button>
    );
};

export default TriggerModalButton
