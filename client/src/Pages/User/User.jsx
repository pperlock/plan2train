import React from 'react'
import "./User.scss"

import ModalContainer from '../../components/ModalContainer/ModalContainer';

function User({user, updateUserProfile}) {
    console.log(user);
    console.log(user.userProfile);
    const {userProfile, company, social} = user[0];
    console.log(userProfile);
    const {lname,fname,username,password,email,phone,address,city,province,country,postal} = userProfile;
    const {facebook, twitter, instagram, linkedIn} = social;
    const {name, description} = company;
    

    return (
        <div className="user-profile">
            <p className="user-profile__type">Profile: Trainer</p>
            <div className="user-profile__bottom">
                <div className="component user-profile__container">
                    <p className="component-title user-profile__title">{`${fname} ${lname}`}</p>
                    
                    <div className="user-profile__sign-in">                       
                        <p className="user-label" >UserName: </p>
                        <p className="user-text"> {username}</p>

                        <p className="user-label" >Password: </p>
                        <p className="user-text"> {password}</p>
                    </div>

                    <div className="user-profile__details">
                        <div className="user-profile__contact">
                            <p className="user-label user-profile__contact-title"> CONTACT </p> 
                            <div className="user-profile-item">
                                <img className="user-icon" src="/icons/email-icon.svg" alt="email"/><p>{email}</p>
                            </div>
                            <div className="user-profile-item">
                                <img className="user-icon" src="/icons/phone-icon.svg" alt="phone number"/><p>{phone}</p>
                            </div>
                        </div>
                        <div className="user-profile__address">
                                <p className="user-label user-profile__address-title">ADDRESS</p>
                                <p className="user-profile__address-item">{address}</p>
                                <p className="user-profile__address-item">{`${city}, ${province}, ${country}`}</p>
                                <p className="user-profile__address-item">{postal}</p>
                        </div>
                    </div>

                    <div className="user-profile__social">
                        <div className="user-profile-item">
                            <img className="user-icon" src="/icons/facebook-icon.svg" alt="facebook"/><p>{facebook}</p>
                        </div>
                        <div className="user-profile-item">
                            <img className="user-icon" src="/icons/twitter-icon.svg" alt="twitter"/><p>{twitter}</p>
                        </div>
                        <div className="user-profile-item">
                            <img className="user-icon" src="/icons/instagram-icon.svg" alt="instagram"/><p>{instagram}</p>
                        </div>
                        <div className="user-profile-item">
                            <img className="user-icon" src="/icons/linkedin-icon.svg" alt="linked-in"/><p>{linkedIn}</p>
                        </div>
                    </div>
                    <ModalContainer buttonText="Update" userProfile={userProfile} updateUserProfile={updateUserProfile}/>
                </div>
                <div className="user-profile__description">
                    <div className="user-profile__description-logo"></div>
                    <div className="user-profile__description-content">
                        <p className="user-profile__description-company">{name}</p>
                        <p className="user-profile__description-description">{description}</p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default User