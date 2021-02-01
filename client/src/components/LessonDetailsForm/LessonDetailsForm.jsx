import React from 'react'
import './LessonDetailsForm.scss';

function LessonDetailsForm({onSubmit, closeModal, lesson}) {
    
    if (!lesson){
        var location = {name:"", address:"", city:"", province:"", country:""}
        var lesson = {date:"", time:"", location}
    }
    var {date, time, location} = lesson;
    var {name,address, city, province, country} = location;   

    const handleSubmit=(event)=>{
        onSubmit(event);
        closeModal();
    }

    return (
        <form id="modal-form" className="modal-form" onSubmit={handleSubmit} >

            <div className="modal-form__when">
                <div className="modal-form__section modal-form__lesson-name">
                    <input className="modal-form__input" id="lessonName" name="lessonName" type="text" defaultValue={lesson.name} required></input>
                    <label className="modal-form__label" htmlFor="fname">Lesson Name</label>
                </div>
     
                <div className="modal-form__section">
                    <input className="modal-form__input modal-form__input--date " id="date" name="date" type="date"  defaultValue={date}></input>
                    <label className="modal-form__label" htmlFor="date">Date</label>
                </div>
                <div className="modal-form__section">   
                    <input className="modal-form__input modal-form__input--time" id="time" name="time" type="time"  defaultValue={time}></input>
                    <label className="modal-form__label" htmlFor="time">Time</label>
                </div>    
            </div>

            <div className="modal-form__section modal-form__lesson-name">
                <input className="modal-form__input" id="locationName" name="locationName" type="text" defaultValue={name}></input>
                <label className="modal-form__label" htmlFor="locationName">Location Name</label>
            </div>
            
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
            </div>
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
        </form>
    )
}

export default LessonDetailsForm