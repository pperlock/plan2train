import React from 'react';

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
 * @param {String} clientError - message to indicate that a username already exists
 */

class ModalContainer extends React.Component {

    state = {isShown:false}

    //toggles the ability to scroll on and off when the modal is opened and closed
    toggleScrollLock = () =>{document.querySelector('html').classList.toggle('scroll-lock')}

    //triggered by clicking the trigger button
    showModal = () =>{
        this.setState({isShown:true}, ()=>{this.toggleScrollLock()})}

    closeModal = () => {
        this.setState({isShown:false}, ()=>{this.toggleScrollLock()});
    };

    //Modal closes if the escape key is pressed
    onKeyDown = (event) =>{
        if(event.keyCode === 27){
            this.closeModal();
        }
    };

    //Checks if the modal contains the current click target and returns - click is within the modal, otherwise close the modal
    onClickOutside = (event) => {
        if (this.modal && this.modal.contains(event.target)) 
        return this.closeModal();
    };


    render(){
        const {modalType, modalName, deleteString, deleteId, information, buttonText, buttonType, onSubmit,url, slider} = this.props;

        return (
            <>
                <TriggerModalButton 
                    slider={slider}
                    showModal={this.showModal}
                    buttonRef={n=>this.TriggerButton=n}
                    buttonText={buttonText}
                    buttonType={buttonType}
                    imageURL={url} 
                />
                {(this.state.isShown && modalType.substring(0,5) ==="login") && 
                    <LoginModal
                        modalType={modalType}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        toggleScrollLock={this.toggleScrollLock}
                    />}

                {(this.state.isShown && modalType ==="delete") && 
                    <DeleteModal
                        modalName={modalName}
                        onSubmit={onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        deleteString={deleteString}
                        deleteId = {deleteId}
                    />}

                {(this.state.isShown && modalType ==="update") && 
                    <Modal
                        modalName={modalName}
                        onSubmit = {onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        information={information}
                    />}

                {(this.state.isShown && modalType ==="note") && 
                    <NoteModal
                        modalName={modalName}
                        onSubmit = {onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        information={information}
                />}
            </>

            
        )
    }
}

export default ModalContainer
