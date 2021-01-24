import React from 'react'
import './LessonDetailsForm.scss';

function LessonDetailsForm({onSubmit, closeModal, lesson}) {
    const {status, name, location, date, time, address, city, province, country, postal} = lesson;
    return (
        <form id="modal-form" className="modal-form" onSubmit={onSubmit} >
            <div>
                <input className="modal-form__input" id="lessonName" name="lessonName" type="text" placeholder="Lesson Name" defaultValue={name}></input>
                <select name="status" id="status">
                    <option value="next"> Next </option>
                    <option value="past"> Past </option>
                </select>

            </div>
            <div>
                <input className="modal-form__input" id="date" name="date" type="date"  defaultValue={date}></input>
                <input className="modal-form__input" id="time" name="time" type="time"  defaultValue={time}></input>
                
            </div>
            <div>
                <input className="modal-form__input" id="location" name="location" type="text"  defaultValue={location}></input>
                <input className="modal-form__input" id="address" name="address" type="text" placeholder="Address" defaultValue={address} ></input>
                <input className="modal-form__input" id="city" name="city" type="text" placeholder="City" defaultValue={city}></input>
                <input className="modal-form__input" id="province" name="province" type="text" placeholder="Province" defaultValue={province}></input>
                <input className="modal-form__input" id="country" name="country" type="text" placeholder="Country" defaultValue={country}></input>
                <input className="modal-form__input" id="postal" name="postal" type="text" placeholder="Postal Code" defaultValue={postal} ></input>
            </div>
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default LessonDetailsForm