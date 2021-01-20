import React from 'react';

import Modal from '../Modal/Modal';
import TriggerModalButton from '../TriggerModalButton/TriggerModalButton';

class ModalContainer extends React.Component {
    state = {isShown:false}

    onSubmit = (event) =>{
        event.preventDefault();
        
        const updatedProfile = {
            type: this.props.userProfile.type,
            username:event.target.username.value,
            fname:event.target.fname.value,
            lname:event.target.lname.value,
            password:event.target.password.value,
            email:event.target.email.value,
            phone:event.target.phone.value,
            address:event.target.address.value,
            city: event.target.city.value,
            province: event.target.province.value,
            country: event.target.country.value,
            social:{facebook:event.target.facebook.value, twitter:event.target.twitter.value, instagram: event.target.instagram.value, linkedIn:event.target.linkedIn.value},
            company:"Dogs North",
            companyDescription: "Dogs North provides training for the every day owner.  We strive to provide you with personalized training that pertains directly to making your life better with your dog every day.  We are proud to be part of the northern ontario community and are here to build great relationships between dogs and their owners in the Timmins, Porcupine, Matheson and Iroquois Falls region."
        }

        console.log(updatedProfile);
        console.log(this.props);

        this.props.updateUserProfile(updatedProfile)
        this.closeModal();
    }

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
        return (
            <>
                <TriggerModalButton 
                    showModal={this.showModal}
                    buttonRef={n=>this.TriggerButton=n}
                    buttonText={this.props.buttonText}
                />

                {this.state.isShown && 
                    <Modal 
                        onSubmit={this.onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                        userProfile={this.props.userProfile}
                    />}
            </>

            
        )
    }
}

export default ModalContainer
