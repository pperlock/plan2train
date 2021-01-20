import React from 'react';
import {Link} from 'react-router-dom';

import "./Clients.scss";

import ClientList from '../../components/ClientList/ClientList';
import ClientProfile from '../../components/ClientProfile/ClientProfile';
import ClientLessons from '../../components/ClientLessons/ClientLessons';

class Clients extends React.Component {

    state={displayResources:[], animateBar:true}

    updateResources=(program)=>{
       this.setState({displayResources:program.resources});
    
    }

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

    getclientPrograms(){
        
    }
    
    render(){

        const {clients, programs, addClient} = this.props;
        const page = this.props.match.path.split("/")[3]; 

        const currentClient = this.props.clients.find(client=> client.userId ===this.props.match.params.clientId);

        var clientPrograms=[];
        currentClient.programs.forEach(programId =>{
            clientPrograms.push(this.props.programs.find(program=> program.id === programId)) 
        });

        const {fname, lname} = currentClient.userProfile;
        const active = currentClient.status ? "Active" : "Archived";

        //determine the current client and get the appropriate program data 
        return (
            <div className="clients__container" style={{backgroundImage: "url('/images/sidebar.')"}}>
                <ClientList list = {clients} match={this.props.match} animate={this.state.animateBar} onSubmitTrainer={addClient} programs={programs}/>
                <div className="client">
                    <div className="client__title">
                        <p className="client__title-name">{`${fname} ${lname}`} </p>
                        <p className="client__title-status">{`Status: ${active}`}</p>
                    </div>
                    <div className="client__nav">
                        <Link to={`/clients/${this.props.match.params.clientId}/profile`} onClick={()=> this.removeAnimation()} className="client__nav-left">Profile</Link>
                        <Link to={`/clients/${this.props.match.params.clientId}/lessons`} onClick={()=> this.removeAnimation()} className="client__nav-right">Lessons</Link>
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
