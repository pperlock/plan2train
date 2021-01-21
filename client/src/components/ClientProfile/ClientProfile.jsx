import React from 'react';
import './ClientProfile.scss';

import List from '../../components/List/List';

function ClientProfile({currentClient}) {
    const {address, city, province, country, postal, email, phone} = currentClient.userProfile;
    return (
         <div className = "client__middle">
            <div className = "component client__contact">
                <div className="client__contact-info">
                    <div className="client__contact-info-top">
                        <div className="client__contact-address"> 
                            <p className="component-title client__contact-title">Contact</p>
                            <p className="client__contact-item"> {address}</p>
                            <p className="client__contact-item"> {city}</p>
                            <p className="client__contact-item"> {`${province},  ${country}`}</p>
                            <p className="client__contact-item"> {postal}</p>
                        </div>
                        <div className="client__contact-contact">
                            <p className="client__contact-item"> {email}</p>
                            <p className="client__contact-item"> {phone}</p>
                        </div>
                    </div>
                </div>
                <div className="client__contact-map">google map</div>
            </div>

            <div className = "component client__notes">
                <p className="component-title">Notes</p>
                <div className="list">
                    {currentClient.notes.map(note=> <List key={note.id} content={note.note} id={note.id} deleteBtn={true}/>)}
                </div>
                <form className="client__notes-form" onSubmit={(event)=>this.props.addNote(event, currentClient)}>
                    <input className="client__notes-new" type="text" name="newNote" placeholder="New Note"></input>
                    <button className=" add client__notes-add"> + </button>
                </form>
            </div>
        </div>
    )
}

export default ClientProfile
