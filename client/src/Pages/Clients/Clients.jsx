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

        console.log("client did update");

        const splitProps = this.props.match.path.split("/")
        const activeLink = splitProps[6]
        console.log(activeLink)

        if (document.querySelector(".active-link")){
            const previouslyActiveLink = document.querySelector(".active-link");
            previouslyActiveLink.classList.remove("active-link");
            
            const activeLinkElement = document.getElementById(activeLink);
            activeLinkElement.classList.add("active-link");
        }
   
    }

    removeAnimation = ()=>{
        this.setState({animateBar:false});
    }

   
    render(){

        const {clients, programs, addClient, updateTrainer, updateClient, deleteClient, match} = this.props;

        // console.log(clients);
        
        //used to determine if we are on the lessons page or the profile page
        const page = this.props.match.path.split("/")[6]; 

        //set the rendered client to be the one that matches the path name
        const currentClient = this.props.clients.find(client=> client.userId ===match.params.clientId);

        const {fname, lname} = currentClient.userProfile;

        // console.log(currentClient);
        
        //status is a boolean to indicate if a client is current or past - used for filter on client bar
        const active = currentClient.status ? "Active" : "Archived";

        return (
            <div className="clients__container">
                {/* displays the list of clients on the side */}
                <ClientList list = {clients} match={this.props.match} animate={this.state.animateBar} onSubmit={addClient} programs={programs}/>
                
                <div className="client" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                    <div className="client__header">
                        <div className="client__header-title">
                            <p className="client__header-title-name">{`${fname} ${lname}`} </p>
                            <p className="client__header-title-status">{`Status: ${active}`}</p>
                        </div>

                        {/* link changes the page variable which changes the componenet rendered */}
                        <div className="client__header-nav">
                            <Link to={`/trainer/${this.props.match.params.username}/${this.props.match.params.trainerId}/clients/${this.props.match.params.clientId}/profile`} 
                                id="profile"
                                onClick={()=> this.removeAnimation()} 
                                className="client__header-nav-link active-link">Profile
                            </Link>
                            <Link to={`/trainer/${this.props.match.params.username}/${this.props.match.params.trainerId}/clients/${this.props.match.params.clientId}/lessons`} 
                                id="lessons"
                                onClick={()=> this.removeAnimation()} 
                                className="client__header-nav-link">Lessons
                            </Link>
                        </div>
                        <div className="client__header-title-delete">
                            <ModalContainer 
                                modalType = "delete" 
                                modalName = "delete" 
                                buttonText="Delete"
                                buttonType="x" 
                                onSubmit={this.props.deleteClient}
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
                        />}

                    {page === "lessons" && <ClientLessons currentClient = {currentClient} programs = {programs} match = {match}/>}
                   
                </div>
            </div>
        )
    }
}

export default Clients
