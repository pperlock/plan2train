import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import "./Clients.scss";

import ClientList from '../../components/ClientList/ClientList';
import ClientProfile from '../../components/ClientProfile/ClientProfile';
import ClientLessons from '../../components/ClientLessons/ClientLessons';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import {API_URL} from '../../App.js';

/**
 * props passed to Clients from Trainer
 * @param {object} programs - all trainer's programs
 * @param {object} clients - all trainer's clients
 * @param {object} match 
 * @param {function} addNote - add Note to a client profile - not used yet
 * @param {function} updateTrainer
 * @param {function} updateClient - update the client information
 * @param {function} deleteClient - delete a client from the db
 */

function Clients({programs, clients, updateTrainer, match, addClient, updateClient, deleteClient, addNote}) {

    //path used to determine if we are on the lessons page or the profile page
    const page = match.path.split("/")[5]; 

    const [activeLink, setActiveLink] = useState(page);

    //set the rendered client to be the one that matches the path name
    const currentClient = clients.find(client=> client.userId === match.params.clientId);

    const {fname, lname} = currentClient.userProfile;

    //status is a boolean to indicate if a client is current or past - will be used for filter on client bar in future
    const active = currentClient.status ? "Active" : "Archived";

    return (
        <div className="clients__container">
            {/* displays the list of clients on the side */}
            <ClientList list = {clients} match={match} onSubmit={addClient} programs={programs}/>
            
            <div className="client" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                <div className="client__header">
                    <div className="client__header-title">
                        <p className="client__header-title-name">{`${fname} ${lname}`} </p>
                        <p className="client__header-title-status">{`Status: ${active}`}</p>
                    </div>

                    {/* link changes the page variable which changes the componenet rendered */}
                    <div className="client__header-nav">
                        <Link to={`/trainer/${match.params.trainerId}/clients/${match.params.clientId}/profile`} 
                            id="profile"
                            onClick={()=>setActiveLink('profile')}
                            className={activeLink === "profile" ? "client__header-nav-link active-link" :"client__header-nav-link"} >Profile
                        </Link>
                        <Link to={`/trainer/${match.params.trainerId}/clients/${match.params.clientId}/lessons`} 
                            id="lessons"
                            onClick={()=>setActiveLink('lessons')}
                            className={activeLink === "lessons" ? "client__header-nav-link active-link" :"client__header-nav-link"}>Lessons
                        </Link>
                    </div>

                    {/* delete client */}
                    <div className="client__header-title-delete">
                        <ModalContainer 
                            modalType = "delete" 
                            modalName = "delete" 
                            buttonText="Delete"
                            buttonType="image"
                            url="/icons/trash.svg" 
                            onSubmit={deleteClient}
                            deleteString={`${fname} ${lname}`}
                            deleteId={currentClient.userId}
                        />
                    </div>
                </div>

                {/* *============== conditionally render the appropriate profile or lessons component ===============* */}
                {page === "profile" && 
                    <ClientProfile 
                        currentClient = {currentClient} 
                        clients={clients} 
                        updateTrainer={updateTrainer}
                        match = {match}
                        updateClient={updateClient}
                        deleteClient={deleteClient}
                        programs={programs}
                        addNote={addNote}
                    />}

                {page === "lessons" && <ClientLessons currentClient = {currentClient} programs = {programs} match = {match}/>}
            </div>
        </div>
    )
}

export default Clients
