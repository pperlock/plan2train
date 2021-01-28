import React from 'react'
import "./User.scss"

import ModalContainer from '../../components/ModalContainer/ModalContainer';

function User({user, updateUserProfile}) {
    // console.log(updateUserProfile);
    // console.log(user.userProfile);
        // console.log(userProfile);
    const {lname,fname,username,password,email,phone,address,city,province,country,postal} = user.contact;
    const {facebook, twitter, instagram, linkedIn} = user.social;
    const {name, description} = user.company;
    const hiddenPassword = password.split("").map(character => "*");
    

    return (
        <div className="user-profile" style={{backgroundImage: "url('/images/main2.jfif')"}}>
            <p className="user-profile__type">Profile: Trainer</p>
            <div className="user-profile__bottom">
                <div className="user-profile__description">
                    <div className="user-profile__description-logo-container"><img src="/images/companyLogo2.png" alt ="company logo" className="user-profile__description-logo"/></div>
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
                                <a href={facebook}><img className="contact-icon" src="/icons/facebook-icon.svg" alt="facebook"/></a>
                                <a href={twitter}><img className="contact-icon" src="/icons/twitter-icon.svg" alt="twitter"/></a>
                                <a href={instagram}><img className="contact-icon" src="/icons/instagram-icon.svg" alt="instagram"/></a>
                                <a href={linkedIn}><img className="contact-icon" src="/icons/linkedin-icon.svg" alt="linked-in"/></a>
                            </div>
                        </div>
                        <div className="user-profile__address">
                                <p className="user-label user-profile__address-title">ADDRESS</p>
                                <p className="user-profile__address-item">{address}</p>
                                <p className="user-profile__address-item">{`${city}, ${province}, ${country}`}</p>
                                <p className="user-profile__address-item">{postal}</p>
                        </div>
                    </div>

                    <ModalContainer modalName = "updateUser" modalType = "update" buttonText="Update" buttonType="accent" information={user} onSubmit={updateUserProfile}/>

                </div>
                
            </div>
        </div>
    )
}

export default User