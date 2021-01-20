import React from 'react';
import {Link} from 'react-router-dom';

import "./Clients.scss";

import ClientList from '../../components/ClientList/ClientList';
import ClientProfile from '../../components/ClientProfile/ClientProfile';
import ClientLessons from '../../components/ClientLessons/ClientLessons';

class Clients extends React.Component {

    
    render(){
    
        const {clients, currentClient, clientPrograms} = this.props;
        const {fname, lname} = currentClient.userProfile;
        const active = currentClient.status ? "Active" : "Archived";
        const page = this.props.match.path.split("/")[3]; 
        
        // console.log(this.props.match.path.split("/"));        
        return (
            <div className="clients__container" style={{backgroundImage: "url('/images/sidebar.')"}}>
                <ClientList list = {clients} match={this.props.match}/>
                <div className="client">
                    <div className="client__title">
                        <p className="client__title-name">{`${fname} ${lname}`} </p>
                        <p className="client__title-status">{`Status: ${active}`}</p>
                    </div>
                    <div className="client__nav">
                        <Link to={`/clients/${this.props.match.params.clientId}/profile`} className="client__nav-left">Profile</Link>
                        <Link to={`/clients/${this.props.match.params.clientId}/lessons`} className="client__nav-right">Lessons</Link>
                    </div>

                    {/* *============== conditionally render the appropriate profile or lessons component ===============* */}
                    {page === "profile" && <ClientProfile currentClient = {currentClient}/>}
                    {page === "lessons" && <ClientLessons currentClient = {currentClient} clientPrograms = {clientPrograms}/>}
                   
                </div>
            </div>
        )
    }
}

export default Clients
