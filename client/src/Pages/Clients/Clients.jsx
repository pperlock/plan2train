import React from 'react';
import {Link} from 'react-router-dom';

import "./Clients.scss";

import ClientList from '../../components/ClientList/ClientList';
import ClientProfile from '../../components/ClientProfile/ClientProfile';
import ClientLessons from '../../components/ClientLessons/ClientLessons';
import List from '../../components/List/List';

class Clients extends React.Component {

    state={displayResources:[]}

    updateResources=(program)=>{
       this.setState({displayResources:program.resources});
    
    }
    
    render(){
    
        const {clients, currentClient, clientPrograms} = this.props;
        const {fname, lname} = currentClient.userProfile;
        const active = currentClient.status ? "Active" : "Archived";
        
        // console.log(this.props.match.path.split("/"));        
        return (
            <div className="clients__container" style={{backgroundImage: "url('/images/sidebar.')"}}>
                <ClientList clients = {clients}/>
                <div className="client">
                    <div className="client__title">
                        <p className="client__title-name">{`${fname} ${lname}`} </p>
                        <p className="client__title-status">{`Status: ${active}`}</p>
                    </div>
                    <div className="client__nav">
                        <Link to={`/clients/${this.props.match.params.clientId}/profile`} className="client__nav-left">Profile</Link>
                        <Link to={`/clients/${this.props.match.params.clientId}/lessons`} className="client__nav-right">Lessons</Link>
                    </div>

                    {this.props.match.path.split("/")[3] === "profile" && <ClientProfile currentClient = {currentClient}/>}
                   
                        <div className="component client__programs">
                            <p className="component-title">Programs</p>
                            <div className="client__programs-content">
                                <ul className="client__programs-list"> 
                                    {clientPrograms.map(program=> <Link key={program.id} to={`/clients/${currentClient.id}`}><li onClick={()=>this.updateResources(program)} className="client__programs-list-item">{program.name}</li></Link>)}
                                </ul>

                                <div className="list client__programs-resources">
                                    {this.state.displayResources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}
                                </div>
                            </div>
                            
                        </div>

                    {/* *============================NOTES============================* */}
                    
                </div>
            </div>
        )
    }
}

export default Clients
