import React from 'react'
import './PersonalDetailsForm.scss';

function PersonalDetailsForm({onSubmit, closeModal, information, modalName}) {

    console.log(modalName);
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

    const handleSubmit=(event)=>{
        onSubmit(event);
        closeModal();
    }

    return (
        <form id="modal-form" className="modal-form" onSubmit={handleSubmit} >
            <div>
                <input className="modal-form__input" id="fname" name="fname" type="text" placeholder="First Name" defaultValue={fname}></input>
                <input className="modal-form__input" id="lname" name="lname" type="text" placeholder="Last Name" defaultValue={lname}></input>
                {modalName === "updateUser" && <input className="modal-form__input" id="username" name="username" type="text" placeholder="User Name" defaultValue={username}></input>}
                {modalName === "updateUser" && <input className="modal-form__input" id="password" name="password" type="text" placeholder="Password" defaultValue={password}></input>}
            </div>
            <div>
                <input className="modal-form__input" id="email" name="email" type="email" placeholder="Email" defaultValue={email}></input>
                <input className="modal-form__input" id="phone" name="phone" type="phone" placeholder="Phone" defaultValue={phone}></input>
            </div>
            <div>
                <input className="modal-form__input" id="address" name="address" type="text" placeholder="Address" defaultValue={address} ></input>
                <input className="modal-form__input" id="city" name="city" type="text" placeholder="City" defaultValue={city}></input>
                <input className="modal-form__input" id="province" name="province" type="text" placeholder="Province" defaultValue={province}></input>
                <input className="modal-form__input" id="country" name="country" type="text" placeholder="Country" defaultValue={country}></input>
                <input className="modal-form__input" id="postal" name="postal" type="text" placeholder="Postal Code" defaultValue={postal} ></input>
            </div>
            {modalName === "updateUser" && 
                <div>
                    <div>
                        <input className="modal-form__input" id="facebook" name="facebook" type="text" placeholder="Facebook" defaultValue={facebook}></input>
                        <input className="modal-form__input" id="twitter" name="twitter" type="text" placeholder="Twitter" defaultValue={twitter}></input>
                        <input className="modal-form__input" id="instagram" name="instagram" type="text" placeholder="Instagram" defaultValue={instagram}></input>
                        <input className="modal-form__input" id="linkedIn" name="linkedIn" type="text" placeholder="Linked In" defaultValue={linkedIn}></input>
                    </div>
                    <div>
                        <input className="modal-form__input" id="companyName" name="companyName" type="text" placeholder="Company Name" defaultValue={name}></input>
                        <input className="modal-form__input" id="companyDescription" name="companyDescription" type="text" placeholder="Company Description" defaultValue={description}></input>
                    </div>
                </div>
            }
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default PersonalDetailsForm
