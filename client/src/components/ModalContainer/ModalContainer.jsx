import React from 'react';

import Modal from '../Modal/Modal';
import DeleteModal from '../DeleteModal/DeleteModal';
import LoginModal from '../LoginModal/LoginModal';
import TriggerModalButton from '../TriggerModalButton/TriggerModalButton';

class ModalContainer extends React.Component {

    //props 
    //buttonText 
    //onSubmit= function that updates trainer state 
    //information - information needed in form; 
    //modalName - used to conditionally pass onsubmit
    //modalType - used to determine which modal to render
    state = {isShown:false}

    showModal = () =>{
        this.setState({isShown:true}, 
            ()=>{
                this.closeButton.focus();
                this.toggleScrollLock();
            })
    }

    toggleScrollLock = () =>{
        document.querySelector('html').classList.toggle('scroll-lock');
    }

    closeModal = () => {
        this.setState({isShown:false});
        this.TriggerButton.focus();
        this.toggleScrollLock();
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
        const {modalType, modalName, deleteString, deleteId, information, buttonText, buttonType, onSubmit} = this.props;

        return (
            <>
                <TriggerModalButton 
                    modalType={modalType}
                    showModal={this.showModal}
                    buttonRef={n=>this.TriggerButton=n}
                    buttonText={buttonText}
                    buttonType={buttonType}
                />
                {(this.state.isShown && modalType.substring(0,5) ==="login") && 
                    <LoginModal
                        modalType={modalType}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                    />}

                {(this.state.isShown && modalType ==="delete") && 
                    <DeleteModal
                        modalName={modalName}
                        onSubmit={onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
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
                        onClickOutside={this.onClickOutside}
                        information={information}
                    />}
            </>

            
        )
    }
}

export default ModalContainer
