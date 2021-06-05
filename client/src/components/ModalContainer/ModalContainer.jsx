import React, {useState} from 'react';

import Modal from '../Modal/Modal';
import DeleteModal from '../DeleteModal/DeleteModal';
import LoginModal from '../LoginModal/LoginModal';
import NoteModal from '../NoteModal/NoteModal';
import TriggerModalButton from '../TriggerModalButton/TriggerModalButton';

/**
 * @param {String} buttonText - text to put on button that triggers modal 
 * @param {Function} onSubmit - function activated by button on modal - generally updates state in some way 
 * @param {Object} information - information used to fill in default values of a form - generally updating 
 * @param {String} modalName - used to conditionally pass onSubmit 
 * @param {String} modalType - used to conditionally render the correct modal 
 * @param {String} deleteString - used to render a dynamic message based on what is being deleted
 * @param {String} deleteId - attached to the delete modal to identify the item being deleted
 * @param {String} url - image to be used if the trigger button is of type "image" 
 */

const ModalContainer  = ({modalType, modalName, deleteString, deleteId, information, buttonText, buttonType, onSubmit, url, slider}) => {

    const [isShown, setIsShown] = useState(false);

    //toggles the ability to scroll on and off when the modal is opened and closed
    const toggleScrollLock = () =>{document.querySelector('html').classList.toggle('scroll-lock')}

    //triggered by clicking the trigger button
    const showModal = () =>{
        setIsShown(true);
        toggleScrollLock();
    }

    const closeModal = () => {
        setIsShown(false);
        toggleScrollLock();
    };

    //Modal closes if the escape key is pressed
    const onKeyDown = (event) =>{
        if(event.keyCode === 27){
            closeModal();
        }
    };

    //Checks if the modal contains the current click target and returns - click is within the modal, otherwise close the modal
    // const onClickOutside = (event) => {
    //     if (this.modal && this.modal.contains(event.target)) 
    //     return this.closeModal();
    // };

    return (
        <>
            <TriggerModalButton 
                slider={slider}
                showModal={showModal}
                buttonText={buttonText}
                buttonType={buttonType}
                imageURL={url} 
            />
            {(isShown && modalType.substring(0,5) ==="login") && 
                <LoginModal
                    modalType={modalType}
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    toggleScrollLock={toggleScrollLock}
                />}

            {(isShown && modalType ==="delete") && 
                <DeleteModal
                    modalName={modalName}
                    onSubmit={onSubmit}
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    deleteString={deleteString}
                    deleteId = {deleteId}
                />}

            {(isShown && modalType ==="update") && 
                <Modal
                    modalName={modalName}
                    onSubmit = {onSubmit}
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    information={information}
                />}

            {(isShown && modalType ==="note") && 
                <NoteModal
                    modalName={modalName}
                    onSubmit = {onSubmit}
                    closeModal={closeModal}
                    onKeyDown={onKeyDown}
                    information={information}
            />}
        </>
    )
}

export default ModalContainer
