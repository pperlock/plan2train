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
        console.log("client-mounted");
        this.setState({animateBar:false});
    }

    componentDidUpdate(){
        console.log("client-updated")
    }

    removeAnimation = ()=>{
        console.log("reached");
        this.setState({animateBar:false});
    }
    
    render(){

        console.log(this.state.animateBar);

        console.log(this.props.match.path)
    
        const {clients, programs, addClient} = this.props;
        console.log(clients);
        console.log(programs);

        const currentClient = clients.find(client=> client.userId ===this.props.match.params.clientId);
        let clientPrograms=[];
        clientPrograms = currentClient.programs.forEach(programId =>{
            clientPrograms.push(programs.filter(program=> program.id === programId)[0]) 
        });

        const {fname, lname} = currentClient.userProfile;
        const active = currentClient.status ? "Active" : "Archived";
        const page = this.props.match.path.split("/")[3]; 
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
