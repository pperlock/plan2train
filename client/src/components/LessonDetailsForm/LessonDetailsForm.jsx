import React from 'react'
import './LessonDetailsForm.scss';

function LessonDetailsForm({onSubmit, closeModal, lesson}) {
    const {date, time, location} = lesson;
    const {name,address, city, province, country} = location;
    return (
        <form id="modal-form" className="modal-form" onSubmit={onSubmit} >
            <div>
                <input className="modal-form__input" id="lessonName" name="lessonName" type="text" placeholder="Lesson Name" defaultValue={lesson.name} ></input>
            </div>
            <div>
                <input className="modal-form__input" id="date" name="date" type="date"  defaultValue={date}></input>
                <input className="modal-form__input" id="time" name="time" type="time"  defaultValue={time}></input>
                
            </div>
            <div>
                <input className="modal-form__input" id="locationName" name="locationName" type="text" placeholder="Location" defaultValue={name}></input>
                <input className="modal-form__input" id="address" name="address" type="text" placeholder="Address" defaultValue={address} ></input>
                <input className="modal-form__input" id="city" name="city" type="text" placeholder="City" defaultValue={city}></input>
                <input className="modal-form__input" id="province" name="province" type="text" placeholder="Province" defaultValue={province}></input>
                <input className="modal-form__input" id="country" name="country" type="text" placeholder="Country" defaultValue={country}></input>
            </div>
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default LessonDetailsForm