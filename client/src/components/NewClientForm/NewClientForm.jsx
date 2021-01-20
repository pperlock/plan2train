import React from 'react'

function NewClientForm({onSubmit, closeModal, programs}) {
    return (
        <form id="modal-form" className="modal-form" onSubmit={onSubmit} >
            <div>
                <input className="modal-form__input" id="fname" name="fname" type="text" placeholder="First Name" ></input>
                <input className="modal-form__input" id="lname" name="lname" type="text" placeholder="Last Name" ></input>
                <input className="modal-form__input" id="username" name="username" type="text" placeholder="User Name" ></input>
                <input className="modal-form__input" id="password" name="password" type="text" placeholder="Password" ></input>
            </div>
            <div>
                <input className="modal-form__input" id="email" name="email" type="email" placeholder="Email" ></input>
                <input className="modal-form__input" id="phone" name="phone" type="phone" placeholder="Phone" ></input>
            </div>
            <div>
                <input className="modal-form__input" id="address" name="address" type="text" placeholder="Address"  ></input>
                <input className="modal-form__input" id="city" name="city" type="text" placeholder="City" ></input>
                <input className="modal-form__input" id="province" name="province" type="text" placeholder="Province" ></input>
                <input className="modal-form__input" id="country" name="country" type="text" placeholder="Country" ></input>
                <input className="modal-form__input" id="postal" name="postal" type="text" placeholder="Postal Code"  ></input>
            </div>
            <div>
                <div className="modal-form__select">
                <label htmlFor="programs">Programs:</label>
                    <select id="programs" name="programs" multiple>
                        {programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default NewClientForm