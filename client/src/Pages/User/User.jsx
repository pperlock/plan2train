import React, {useState, useEffect} from 'react'
import "./User.scss"
import firebase from '../../firebase';
import axios from 'axios';

import ModalContainer from '../../components/ModalContainer/ModalContainer';

function User({user, updateUserProfile, match, updateTrainer}) {
    // console.log(updateUserProfile);
    // console.log(user.userProfile);
        // console.log(userProfile);
    const {lname,fname,username,password,email,phone,address,city,province,country,postal} = user.contact;
    const {facebook, twitter, instagram, linkedIn} = user.social;
    const {name, description, logo} = user.company;
    const hiddenPassword = password.split("").map(character => "*");

    const [selectedFile, setSelectedFile] = useState(null)
    const [showFileInput, setShowFileInput] = useState(false)

   /** ================================================ ADD LOGO ================================================*/

    const activateFileSelector=()=>{
        const inputBox = document.getElementById('inputFile');
        inputBox.click();
    }
    const fileSelectedHandler = event =>{
        setSelectedFile(event.target.files[0]); 
    }

    const fileUpload=()=>{
        // event.preventDefault();
        if(!!selectedFile){
            let bucketName = match.params.trainerId;
            let storageRef = firebase.storage().ref(`/${bucketName}/${selectedFile.name}`);
            let uploadTask = storageRef.put(selectedFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{
                    console.log("Uploading ...")
                },
                ()=>{
                    console.log("Upload Unsuccessful");
                },
                ()=>{
                    let storageLoc = firebase.storage().ref();
                    storageLoc.child(`/${bucketName}/${selectedFile.name}`).getDownloadURL()
                    .then((url)=>{
                        const logo={logo:url}
                        axios.put(`http://localhost:8080/trainer/${match.params.trainerId}/updateLogo`, logo)
                        .then(res =>{
                            console.log(res);
                            updateTrainer();
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                }   
            )
        }
    }

    useEffect(()=>{
        fileUpload()
    },[selectedFile])

    return (
        <div className="user-profile" style={{backgroundImage: "url('/images/main2.jfif')"}}>
            <p className="user-profile__type">Profile: Trainer</p>
            <div className="user-profile__bottom">
                <div className="user-profile__description">
                   
                    <div className="user-profile__description-logo-container">

                        <img src={logo !=="" ? logo : "/icons/add-icon.svg"} alt ="company logo" className="user-profile__description-logo" onClick={activateFileSelector}/>
                        
                        <input id="inputFile" type="file" className="user-profile__description-input" onChange={fileSelectedHandler}></input>

                    </div>
                    <div className="user-profile__description-content">
                        <p className="user-profile__description-company">{name}</p>
                        <p className="user-profile__description-description">{description}</p>
                    </div>
                </div>
                <div className="component user-profile__container">
                    <p className="component-title user-profile__title">{`${fname} ${lname}`}</p>
                    
                    <div className="user-profile__sign-in">                       
                        <p className="user-label" >UserName: </p>
                        <p className="user-text"> {username}</p>

                        <p className="user-label" >Password: </p>
                        <p className="user-text"> {hiddenPassword}</p>
                    </div>

                    <div className="user-profile__details">
                        <div className="user-profile__contact">
                            <p className="user-label user-profile__contact-title"> CONTACT </p> 
                            <div className="user-profile-item">
                                <img className="contact-icon" src="/icons/email-icon.svg" alt="email"/><p>{email}</p>
                            </div>
                            <div className="user-profile-item">
                                <img className="contact-icon" src="/icons/phone-icon.svg" alt="phone number"/><p>{phone}</p>
                            </div>

                            <div className="user-profile__social">
                                <a href={facebook}><img className="contact-icon--social" src="/icons/facebook-icon.svg" alt="facebook"/></a>
                                <a href={twitter}><img className="contact-icon--social" src="/icons/twitter-icon.svg" alt="twitter"/></a>
                                <a href={instagram}><img className="contact-icon--social" src="/icons/instagram-icon.svg" alt="instagram"/></a>
                                <a href={linkedIn}><img className="contact-icon--social" src="/icons/linkedin-icon.svg" alt="linked-in"/></a>
                            </div>
                        </div>
                        <div className="user-profile__address">
                                <p className="user-label user-profile__address-title">ADDRESS</p>
                                <p className="user-profile__address-item">{address}</p>
                                <p className="user-profile__address-item">{`${city}, ${province}, ${country}`}</p>
                                <p className="user-profile__address-item">{postal}</p>
                        </div>
                    </div>

                    <div className="user-profile__update">
                        <ModalContainer modalName = "updateUser" modalType = "update" buttonText="Update" buttonType="image" url="/icons/user-edit.svg" information={user} onSubmit={updateUserProfile}/>
                    </div>

                </div>
                
            </div>
        </div>
    )
}

export default User