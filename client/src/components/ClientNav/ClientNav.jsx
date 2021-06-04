import React, {useContext} from 'react'
import {NavLink, useParams, useHistory} from 'react-router-dom';
import axios from 'axios';

import ModalContainer from '../../components/ModalContainer/ModalContainer';

import TrainerContext from '../../store/trainer-context';
import {API_URL} from '../../App.js';

function ClientNav() {

    const {trainerId, clientId} = useParams();
    const {clients, setClients} = useContext(TrainerContext);
    const history= useHistory();

    const {fname, lname} = clients.find(client => client.userId === clientId).userProfile;

    /** ================================================ DELETE CLIENT ================================================*/
    const deleteClient= async(clientId)=>{

        // send a request to the db to delete a client with the specified programId
            await axios.delete(`${API_URL}/client/${clientId}`)
    
            //remove the client from state
            const clientLoc = clients.findIndex(client => client.userId === clientId);
            const clientCopy=[...clients];
            clientCopy.splice(clientLoc,1);
    
            //if the client removed was the only one on the list send the user to the empty clients page
            if((clients.length - 1) === 0){
                history.push(`/trainer/${trainerId}/clients`)
            }else{
                const clientLoc = clients.findIndex(client => client.userId === clientId);
                //send the user to the first client on the list unless the one removed was at 0 index, the route to client at index 1
                
                clientLoc !== 0 ? 
                history.push(`/trainer/${trainerId}/clients/${clients[0].userId}/profile`)
                :
                history.push(`/trainer/${trainerId}/clients/${clients[1].userId}/profile`)
            }
            
            setClients(clientCopy);
        }

    return (
        <div className="client__header">
            <div className="client__header-title">
                <p className="client__header-title-name">{`${fname} ${lname}`} </p>
            </div>

            {/* link changes the page variable which changes the component rendered */}
            <div className="client__header-nav">
                <NavLink to={`/trainer/${trainerId}/clients/${clientId}/profile`} 
                    id="profile"
                    activeClassName="active-link" >Profile
                </NavLink>
                <NavLink to={`/trainer/${trainerId}/clients/${clientId}/lessons`} 
                    id="lessons"
                    activeClassName="active-link" >Lessons
                </NavLink>
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
                    deleteId={clientId}
                />
            </div>
        </div>     
    )
}

export default ClientNav
