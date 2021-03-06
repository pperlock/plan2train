import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom';
import firebase from '../../firebase';
import axios from 'axios';

import "./Trainer.scss"

import ModalContainer from '../../components/ModalContainer/ModalContainer';
import TrainerContext from '../../store/trainer-context';

import {API_URL} from '../../App';


const Trainer = () => {

    const {userProfile, setUserProfile, setTrainerId, updateUserProfile} = useContext(TrainerContext);

    const {trainerId} = useParams();

    //store the selected file in state
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(()=>{
        setTrainerId(trainerId);
    },[]);

   /** ================================================ ADD LOGO ================================================*/

   //activate the click method on the invisible input box when the logo is clicked 
   const activateFileSelector=()=>{
        const inputBox = document.getElementById('inputFile');
        inputBox.click();
    }
    
    //get the file selected from the file picker and store it in state
    const fileSelectedHandler = event =>{
        setSelectedFile(event.target.files[0]); 
    }

    //upload the logo file to firebase storage in the trainer's
    const fileUpload=()=>{
        if(!!selectedFile){
            let bucketName = trainerId;
            let storageRef = firebase.storage().ref(`/${bucketName}/${selectedFile.name}`);
            let uploadTask = storageRef.put(selectedFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{
                    console.log("Uploading ...")
                },
                ()=>{
                    console.log("Upload Unsuccessful");
                },
                async ()=>{
                    //once the file is uploaded get the url and save it to the db and update the trainer component
                    let storageLoc = firebase.storage().ref();
                    
                    try {
                    
                        const url = await storageLoc.child(`/${bucketName}/${selectedFile.name}`).getDownloadURL();
                        const logo={logo:url};

                        const res = await axios.put(`${API_URL}/trainer/${trainerId}/updateLogo`, logo);
                        const profileCopy = {...userProfile};
                        profileCopy.company.logo = res.data;
                        setUserProfile(profileCopy);
                    
                    }catch(err){
                        console.log(err);
                    }
                }   
            )
        }
    }

    //fire the fileupload function any time the selectedFile is changed in state
    useEffect(()=>{
        fileUpload();
    },[selectedFile, fileUpload])


    const {lname,fname,username,password,email,phone,address,city,province,country,postal} = userProfile ? userProfile.contact : {};
    const {facebook, twitter, instagram, linkedIn} = userProfile ? userProfile.social : {};
    const {name, description, logo} = userProfile ? userProfile.company : {};

     //show the password as *****
     const hiddenPassword = password && password.split("").map(character => "*");
   
    return (
        <>
            {userProfile &&  
                <div className="user-profile" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                    <p className="user-profile__type">Profile: Trainer</p>
                    <div className="user-profile__bottom">
                        <div className="user-profile__description">
                        
                            <div className="user-profile__description-logo-container">

                                {/* render the logo from the db - if there isn't one use the image icon stored on the front end */}
                                <img src={logo !=="" ? logo : "/icons/image.svg"} alt ="company logo" className="user-profile__description-logo" onClick={activateFileSelector}/>
                                
                                <input id="inputFile" type="file" className="user-profile__description-input" onChange={fileSelectedHandler}></input>

                            </div>
                            <div className="user-profile__description-content">
                                <p className="user-profile__description-company">{name}</p>
                                <p className="user-profile__description-description">{description}</p>
                            </div>
                        </div>
                        <div className="component user-profile__container">
                            <p className="component-title user-profile__title">{`${fname} ${lname}`}</p>
                            
                            {(username !=="google" && username !=="facebook") &&
                            <div className="user-profile__sign-in">                       
                                <p className="user-label" >UserName: </p>
                                <p className="user-text"> {username}</p>

                                <p className="user-label" >Password: </p>
                                <p className="user-text"> {hiddenPassword}</p>
                            </div>
                            }

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
                                        <a href={facebook} target="_blank" rel="noopener noreferrer"><img className="contact-icon--social" src="/icons/facebook-icon.svg" alt="facebook"/></a>
                                        <a href={twitter} target="_blank" rel="noopener noreferrer"><img className="contact-icon--social" src="/icons/twitter-icon.svg" alt="twitter"/></a>
                                        <a href={instagram} target="_blank" rel="noopener noreferrer"><img className="contact-icon--social" src="/icons/instagram-icon.svg" alt="instagram"/></a>
                                        <a href={linkedIn} target="_blank" rel="noopener noreferrer"><img className="contact-icon--social" src="/icons/linkedin-icon.svg" alt="linked-in"/></a>
                                    </div>
                                </div>
                                <div className="user-profile__address">
                                        <p className="user-label user-profile__address-title">ADDRESS</p>
                                        <p className="user-profile__address-item">{address}</p>
                                        <p className="user-profile__address-item">{`${city}, ${province}, ${country}`}</p>
                                        <p className="user-profile__address-item">{postal}</p>
                                </div>
                            </div>

                            {/* render the modalcontainer along with the button used to trigger it for updating the user profile */}
                            <div className="user-profile__update">
                                <ModalContainer 
                                    modalName = "updateUser" 
                                    modalType = "update" 
                                    buttonText="Update" 
                                    buttonType="image" 
                                    url="/icons/user-edit.svg" 
                                    information={userProfile} onSubmit={updateUserProfile}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Trainer
