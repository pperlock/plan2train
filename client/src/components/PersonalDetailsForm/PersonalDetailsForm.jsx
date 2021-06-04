import React from 'react'
import './PersonalDetailsForm.scss';

/**
 * This Modal is used for updating client and user information - inputs are rendered conditionally
 * @param {Function} onSubmit - function activated by button on modal - generally updates state in some way 
 * @param {Object} information - information used to fill in default values of a form - generally updating 
 * @param {String} modalName - used to conditionally render input boxes
 * @param {String} closeModal - closes the modal when cancel or "x" is clicked
*/

function PersonalDetailsForm({onSubmit, closeModal, information, modalName}) {

    // if the modal is used to update information then fill the input boxes with the current information, otherwise leave the inputs empty
    if (modalName === "updateUser"){
        var {lname,fname,username,password,email,phone,address,city,province,country,postal} = information.contact;
        var {facebook, twitter, instagram, linkedIn} = information.social;
        var {name, description} = information.company;
    }else{
        lname= information.userProfile.lname;
        fname= information.userProfile.fname;
        email= information.userProfile.email;
        phone= information.userProfile.phone;
        address= information.userProfile.address;
        city= information.userProfile.city;
        province= information.userProfile.province;
        country= information.userProfile.country;
        postal = information.userProfile.postal;
    }

    //function used to fire the onsubmit function as well as close the modal when the form is submitted
    const handleSubmit=(event)=>{
        onSubmit(event);
        closeModal();
    }

    return (
        <form id="modal-form" className={modalName==="updateUser" ? "modal-form modal-form__personal" : "modal-form modal-form__client"} onSubmit={handleSubmit} >
            <div className="modal-form__upper">
                <div className={modalName==="updateUser" ? "modal-form__left" : ""}>
                    
                    <div className="lesson-divider"></div>

                    <div className="modal-form__user">
                        <div className="modal-form__section">
                            <input className="modal-form__input" id="fname" name="fname" type="text" placeholder="First Name" defaultValue={fname}></input>
                            <label className="modal-form__label" htmlFor="fname">First Name</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input" id="lname" name="lname" type="text" placeholder="Last Name" defaultValue={lname}></input>
                            <label className="modal-form__label" htmlFor="lname">Last Name</label>
                        </div>

                        {modalName === "updateUser" && 
                            <div className="modal-form__section">
                                <input className="modal-form__input" id="username" name="username" type="text" placeholder="User Name" defaultValue={username}></input>
                                <label className="modal-form__label" htmlFor="username">Username</label>
                            </div>}
                        {modalName === "updateUser" && 
                            <div className="modal-form__section">
                                <input className="modal-form__input" id="password" name="password" type="text" placeholder="Password" defaultValue={password}></input>
                                <label className="modal-form__label" htmlFor="password">Password</label>
                            </div>}  
                    </div> 

                    <div className="modal-form__contact">
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--email" id="email" name="email" type="email" placeholder="Email" defaultValue={email}></input>
                            <label className="modal-form__label" htmlFor="email">Email</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input" id="phone" name="phone" type="phone" placeholder="Phone" defaultValue={phone}></input>
                            <label className="modal-form__label" htmlFor="phone">Phone #</label>
                        </div>
                    </div>

                    <div className="lesson-divider"></div>

                    <div className="modal-form__address">
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--address" id="address" name="address" type="text" placeholder="Address" defaultValue={address} ></input>
                            <label className="modal-form__label" htmlFor="address">Street</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input " id="city" name="city" type="text" placeholder="City" defaultValue={city}></input>
                            <label className="modal-form__label" htmlFor="city">City</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--province" id="province" name="province" type="text" placeholder="Province" defaultValue={province}></input>
                            <label className="modal-form__label" htmlFor="province">Province</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--country" id="country" name="country" type="text" placeholder="Country" defaultValue={country}></input>
                            <label className="modal-form__label" htmlFor="country">Country</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--postal" id="postal" name="postal" type="text" placeholder="Postal Code" defaultValue={postal} ></input>
                            <label className="modal-form__label" htmlFor="postal">Postal Code</label>
                        </div>
                    </div>

                    <div className="lesson-divider"></div>
                
                    {modalName === "updateUser" && 
                    <div className="modal-form__social">
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--social" id="facebook" name="facebook" type="text" placeholder="Facebook" defaultValue={facebook}></input>
                            <label className="modal-form__label" htmlFor="facebook">Facebook</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--social" id="twitter" name="twitter" type="text" placeholder="Twitter" defaultValue={twitter}></input>
                            <label className="modal-form__label" htmlFor="twitter">Twitter</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--social" id="instagram" name="instagram" type="text" placeholder="Instagram" defaultValue={instagram}></input>
                            <label className="modal-form__label" htmlFor="instagram">Instagram</label>
                        </div>
                        <div className="modal-form__section">
                            <input className="modal-form__input modal-form__input--social" id="linkedIn" name="linkedIn" type="text" placeholder="Linked In" defaultValue={linkedIn}></input>
                            <label className="modal-form__label" htmlFor="linkedIn">Linked In</label>
                        </div>
                    </div>
                    }
                </div>
                {modalName === "updateUser" &&
                    <div>
                        <div className="modal-form__company">
                            <div className="modal-form__section">
                                <input className="modal-form__input" id="companyName" name="companyName" type="text" placeholder="Company Name" defaultValue={name}></input>
                                <label className="modal-form__label" htmlFor="linkedIn">Company Name</label>
                            </div>    
                            <div className="modal-form__section">
                                <label className="modal-form__label modal-form__textarea-label" htmlFor="linkedIn">Company Description</label>
                                <textarea className="modal-form__input modal-form__textarea" form="modal-form" wrap="hard" name="companyDescription" id="companyDescription" defaultValue={description} placeholder="Enter Company Description" rows="20" cols="35"></textarea>
                            </div>
                        </div>
                    </div>
                }
            </div>
            
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default PersonalDetailsForm
