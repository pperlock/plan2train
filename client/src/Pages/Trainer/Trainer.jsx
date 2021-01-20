import React from 'react';
import axios from 'axios';

import "./Trainer.scss"

import SideBar from '../../components/SideBar/SideBar';
import Programs from '../Programs/Programs';
import Clients from '../Clients/Clients';
import Schedule from '../Schedule/Schedule';
import User from '../User/User';

class Trainer extends React.Component{
    
    state={userProfile:null, programs:[], clients:null}

    componentDidMount(){
        axios.get(`http://localhost:8080/trainer/${this.props.match.params.username}/${this.props.match.params.trainerId}`)
        .then(res =>{
            // console.log(res.data)
            this.setState({userProfile:res.data.userProfile, programs:res.data.programs})
        })

        axios.get(`http://localhost:8080/trainer/${this.props.match.params.trainerId}/clients`)
        .then(clientRes=>{
            // console.log(clientRes.data);
            this.setState({clients:clientRes.data})
        })

    }

    updateUserProfile=(updatedProfile)=>{
        this.setState({userProfile:updatedProfile});
    }

    addNote=(event,currentClient)=>{
        event.preventDefault();
        const newNote = {
            id:'5',
            note:event.target.newNote.value
        }

        let clientsCopy = [...this.state.clients];
        const clientIndex = clientsCopy.findIndex(client => client.id===currentClient.id);
        clientsCopy[clientIndex].notes.push(newNote);
            
        // console.log(...this.state.clients[clientIndex].notes);
        this.setState({clients:clientsCopy})

        event.target.newNote.value="";
    }
    
    render(){
 
        const {match} = this.props;

        // console.log(this.state.clients)

        const defaultClientId = this.state.clients && this.state.clients[0].userId;
        const currentClient = this.state.clients && this.state.clients.filter(client=>client.userId===match.params.clientId)[0];
        // console.log(match.params.clientId);
        // console.log(this.state.clients)
        // console.log(currentClient);

        let clientPrograms=[];
        if (currentClient) {
            currentClient.programs.forEach(programId =>{
                clientPrograms.push(this.state.programs.filter(program=> program.id === programId)[0]) 
            });
        }

        return (
            <>
                {this.state.userProfile && <SideBar defaultClientId = {defaultClientId} defaultProgramId = {this.state.programs[0].id} programs={this.state.programs} match={match}/>}
                {(this.state.userProfile && match.path==="/programs/:programId") && <Programs programs={this.state.programs} currentProgramId={match.params.programId} match={match}/>}
                {(this.state.userProfile && match.path==="/clients/:clientId/profile") && <Clients {...this.props} programs={this.state.programs} clients={this.state.clients} currentClient={currentClient} clientPrograms={clientPrograms} addNote={this.addNote}/>}
                {(this.state.userProfile && match.path==="/clients/:clientId/lessons") && <Clients {...this.props} programs={this.state.programs} clients={this.state.clients} currentClient={currentClient} clientPrograms={clientPrograms} addNote={this.addNote}/>}
                {(this.state.userProfile && match.path==="/schedule") && <Schedule />}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <User user={this.state.userProfile} updateUserProfile={this.updateUserProfile}/>}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <h1>hello</h1>}
                
            </>
        )
    }
}

export default Trainer
