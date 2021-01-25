import React from 'react';
import {Link} from 'react-router-dom';

import "./Clients.scss";

import ClientList from '../../components/ClientList/ClientList';
import ClientProfile from '../../components/ClientProfile/ClientProfile';
import ClientLessons from '../../components/ClientLessons/ClientLessons';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

/**
 * props passed to Clients from Trainer
 * @param {object} programs - all trainer's programs
 * @param {object} clients - all trainer's clients
 * @param {function} addNote - add Note to a client profile - not used yet
 * @param {function} addClient - add a new client to the db
 * @param {function} updateClient - update the client information
 * @param {function} deleteClient - delete a client from the db
 */

class Clients extends React.Component {

    // This might change from a class to functional - have to check into sliding menu

    state={animateBar:true}

    componentDidMount(){
        // console.log("client-mounted");
        this.setState({animateBar:false});
    }

    componentDidUpdate(){
        // console.log("client-updated")
    }

    removeAnimation = ()=>{
        this.setState({animateBar:false});
    }

   
    render(){

        const {clients, programs, addClient, updateClient, deleteClient} = this.props;
        
        //used to determine if we are on the lessons page or the profile page
        const page = this.props.match.path.split("/")[3]; 

        //set the rendered client to be the one that matches the path name
        const currentClient = this.props.clients.find(client=> client.userId ===this.props.match.params.clientId);

        const {fname, lname} = currentClient.userProfile;
        
        //status is a boolean to indicate if a client is current or past - used for filter on client bar
        const active = currentClient.status ? "Active" : "Archived";

        return (
            <div className="clients__container" style={{backgroundImage: "url('/images/sidebar.')"}}>
                {/* displays the list of clients on the side */}
                <ClientList list = {clients} match={this.props.match} animate={this.state.animateBar} onSubmitTrainer={addClient} programs={programs}/>
                
                <div className="client">
                    <div className="client__title">
                        <p className="client__title-name">{`${fname} ${lname}`} </p>
                        <p className="client__title-status">{`Status: ${active}`}</p>
                    </div>

                    {/* link changes the page variable which changes the componenet rendered */}
                    <div className="client__nav">
                        <Link to={`/clients/${this.props.match.params.clientId}/profile`} onClick={()=> this.removeAnimation()} className="client__nav-left">Profile</Link>
                        <Link to={`/clients/${this.props.match.params.clientId}/lessons`} onClick={()=> this.removeAnimation()} className="client__nav-right">Lessons</Link>
                    </div>

                    {/* add and delete client functionality only shown on the profile page */}
                    {page === "profile" && 
                        <div className="client__modify">
                            <ModalContainer 
                                modalType = "update" 
                                modalName = "updateClient" 
                                buttonText="Modify" 
                                onSubmitTrainer={updateClient} 
                                information={currentClient}
                                />
                            <ModalContainer 
                                modalType = "delete" 
                                modalName = "delete" 
                                buttonText="Delete" 
                                onSubmitTrainer={deleteClient}
                                deleteString={`${fname} ${lname}`}
                                deleteId={currentClient.userId}/>
                        </div>
                    }

                    {/* *============== conditionally render the appropriate profile or lessons component ===============* */}
                    {page === "profile" && <ClientProfile currentClient = {currentClient}/>}
                    {page === "lessons" && <ClientLessons currentClient = {currentClient} programs = {programs}/>}
                   
                </div>
            </div>
        )
    }
}

export default Clients
