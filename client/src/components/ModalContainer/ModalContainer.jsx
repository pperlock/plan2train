import React from 'react';

import Modal from '../Modal/Modal';
import DeleteModal from '../DeleteModal/DeleteModal';
import LoginModal from '../LoginModal/LoginModal';
import TriggerModalButton from '../TriggerModalButton/TriggerModalButton';

class ModalContainer extends React.Component {

    //props 
    //buttonText 
    //onSubmitTrainer= function that updates trainer state 
    //information - information needed in form; 
    //modalName - used to conditionally pass onsubmit
    //modalType - used to determine which modal to render
    state = {isShown:false}

    getOnSubmit = ()=>{
        let onSubmit = null;
        const modal = this.props.modalName;
        if(modal ==="addClient"){
            onSubmit=this.addClient;
        }else if (modal === "updateUser"){
            //onSubmit=this.updateUser;
        }else if (modal === "addProgram"){
            onSubmit=this.addProgram;
        }else if (modal === "delete"){
            onSubmit=this.deleteItem;
        }else if (modal === "modifyLesson"){
            onSubmit=this.updateDetails;
        }else if (modal === "updateClient"){
            onSubmit=this.updateclient;
        }
        return onSubmit
    }

    /** ================================================ ADD CLIENT ================================================*/
    addClient = (event) =>{
        event.preventDefault();

        console.log(event.target.programs);

        const options = event.target.programs.options;
        let opt="";

        let programs = [];
        for(var i=0; i<options.length; i++){
            opt = options[i];
            opt.selected && programs.push(opt.value);
        }

        const newClient = {
            trainerId:"",
            username:event.target.username.value,
            password:event.target.password.value,
            profile:"client",
            status:"active",
            userProfile:{
                fname:event.target.fname.value,
                lname:event.target.lname.value,
                email:event.target.email.value,
                phone:event.target.phone.value,
                address:event.target.address.value,
                city: event.target.city.value,
                province: event.target.province.value,
                country: event.target.country.value
            },
            programs:programs
        }

        console.log(newClient);


        this.props.onSubmitTrainer(newClient)
        this.closeModal();
    }

     /** ================================================ Update CLIENT ================================================*/
     updateclient = (event) =>{
        event.preventDefault();

        const updatedProfile = {
                fname:event.target.fname.value,
                lname:event.target.lname.value,
                email:event.target.email.value,
                phone:event.target.phone.value,
                address:event.target.address.value,
                city: event.target.city.value,
                province: event.target.province.value,
                country: event.target.country.value,
                postal:event.target.postal.value
        }
        console.log(updatedProfile);
        this.props.onSubmitTrainer(updatedProfile)
        this.closeModal();
    }

    /** ================================================ ADD CLIENT ================================================*/
    addProgram = (event) =>{
        event.preventDefault();

        const newProgram = {
            name:event.target.programName.value,
            description:event.target.programDescription.value
        }

        console.log(newProgram);

        this.props.onSubmitTrainer(newProgram)
        this.closeModal();
    }

    /** ================================================ DELETE ITEM ================================================*/

    deleteItem = (id) =>{
        this.props.onSubmitTrainer(id)
        this.closeModal();
    }

    /** ================================================ UPDATE LESSON ================================================*/

    updateDetails = (event)=>{
        event.preventDefault();
        
        const updatedDetails = {
            current:this.props.information.current,
            name:event.target.lessonName.value,
            date:event.target.date.value,
            time:event.target.time.value,
            location:{
                name:event.target.locationName.value,
                address:event.target.address.value,
                city:event.target.city.value,
                province:event.target.province.value,
                country:event.target.country.value
            }
        }
        
        console.log(updatedDetails);

        this.props.onSubmitTrainer(updatedDetails);
        this.closeModal();
    }



    /** ================================================ MODAL FUNCTIONS ================================================*/

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
        const onSubmit = this.getOnSubmit();
        // console.log(this.props.modalType)

        return (
            <>
                <TriggerModalButton 
                    modalType={this.props.modalType}
                    showModal={this.showModal}
                    buttonRef={n=>this.TriggerButton=n}
                    buttonText={this.props.buttonText}
                    buttonType={this.props.buttonType}
                />
                {(this.state.isShown && this.props.modalType.substring(0,5) ==="login") && 
                    <LoginModal
                        modalType={this.props.modalType}
                        onSubmit={this.props.onSubmitTrainer}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                    />}

                {(this.state.isShown && this.props.modalType ==="delete") && 
                    <DeleteModal
                        modalName={this.props.modalName}
                        onSubmit={onSubmit}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                        deleteString={this.props.deleteString}
                        deleteId = {this.props.deleteId}
                    />}

                {(this.state.isShown && this.props.modalType ==="update") && 
                    <Modal
                        modalName={this.props.modalName}
                        //onSubmit={onSubmit}
                        onSubmit = {this.props.onSubmitTrainer}
                        modalRef={n=> this.modal = n}
                        buttonRef={n=> this.closeButton=n}
                        closeModal={this.closeModal}
                        onKeyDown={this.onKeyDown}
                        onClickOutside={this.onClickOutside}
                        information={this.props.information}
                    />}
            </>

            
        )
    }
}

export default ModalContainer
