import React from 'react';
import axios from 'axios';

import "./Trainer.scss"

import SideBar from '../../components/SideBar/SideBar';
import Programs from '../Programs/Programs';
import Clients from '../Clients/Clients';
import Schedule from '../Schedule/Schedule';
import User from '../User/User';

class Trainer extends React.Component{
    
    state={files:null, username:this.props.match.params.username, trainerId: this.props.match.params.trainerId, userProfile:null, programs:null, clients:null, updated:false}


    componentDidMount(){
        axios.get(`http://localhost:8080/trainer/${this.state.username}/${this.state.trainerId}`)
        .then(res =>{
            // console.log(res.data)
            this.setState({userProfile:res.data.userProfile, programs:res.data.programs},()=>{
                axios.get(`http://localhost:8080/trainer/${this.state.trainerId}/clients`)
                .then(clientRes=>{
                    this.setState({clients:clientRes.data})
                })
            })
        })
        console.log("trainer-componentDidMount")
    }

    componentDidUpdate(){
        console.log("trainer-didupdate");
        if(this.state.updated){
            axios.get(`http://localhost:8080/trainer/${this.state.username}/${this.state.trainerId}`)
            .then(res =>{
                // console.log(res.data)
                this.setState({userProfile:res.data.userProfile, programs:res.data.programs},()=>{
                    axios.get(`http://localhost:8080/trainer/${this.state.trainerId}/clients`)
                    .then(clientRes=>{
                        this.setState({clients:clientRes.data})
                    })
                })
                this.setState({updated:false})
            })
        }
    }

    /** ================================================ UPDATE TRAINER ================================================*/
    updateUserProfile=(event)=>{
        
        event.preventDefault();

        const updatedProfile = {
            contact:{
                username:event.target.username.value,
                fname:event.target.fname.value,
                lname:event.target.lname.value,
                password:event.target.password.value,
                email:event.target.email.value,
                phone:event.target.phone.value,
                address:event.target.address.value,
                city: event.target.city.value,
                province: event.target.province.value,
                country: event.target.country.value,
                postal:event.target.postal.value
            },
            social:{facebook:event.target.facebook.value, twitter:event.target.twitter.value, instagram: event.target.instagram.value, linkedIn:event.target.linkedIn.value},
            company:{
                name:event.target.companyName.value,
                description: event.target.companyDescription.value
            }
        }

        console.log(this.state.userProfile.userId);
        axios.put(`http://localhost:8080/trainer/${this.props.match.params.trainerId}/updateDetails`, updatedProfile)
        .then(res =>{
            this.setState({userProfile:updatedProfile});
        })
        .catch(err=>{
            console.log(err);
        })
    }

    /** ================================================ ADD PROGRAM ================================================*/
    addProgram=(event)=>{

        event.preventDefault();

        const newProgram = {
            name:event.target.programName.value,
            description:event.target.programDescription.value
        }

        console.log(newProgram);
        
        axios.post(`http://localhost:8080/trainer/${this.props.match.params.trainerId}/addProgram`, newProgram)
        .then(res =>{
            this.setState({programs:[...this.state.programs, res.data]})
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ DELETE PROGRAM ================================================*/
    deleteProgram = (programId) =>{

        console.log(programId)

        axios.delete(`http://localhost:8080/program/${this.props.match.params.programId}`)
        .then(res =>{
            this.props.history.push(`/trainer/${this.props.match.params.username}/${this.props.match.params.trainerId}/programs/${this.state.programs[0].id}`)
            this.setState({updated:true});//trigger the component did update to pull updated data from db
        })
        .catch(err=>{
            console.log(err);
        }) 
    }

    /** ================================================ ADD RESOURCE ================================================*/
    addResource=(newResource, programId)=>{
        axios.post(`http://localhost:8080/program/${this.props.match.params.programId}/addResource`, newResource)
        .then(res =>{
            //make a copy of the programs in state
            const programsCopy = this.state.programs;
            // find the location of the program to update?
            const programLoc = programsCopy.findIndex(program =>program.id ===programId);
            //remove that program from the array
            programsCopy.splice(programLoc,1);
            //add the new program returned by the axios call
            programsCopy.push(res.data);
            console.log(programsCopy);
            //update the state to the modified program array
            this.setState({programs:programsCopy});
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ DELETE RESOURCE ================================================*/
    deleteResource = (resourceId) =>{

        axios.delete(`http://localhost:8080/program/${this.props.match.params.programId}/${resourceId}`)
        .then(res =>{
            this.setState({updated:true});//trigger the component did update to pull updated data from db
        })
        .catch(err=>{
            console.log(err);
        }) 
    }

    /** ================================================ ADD CLIENT ================================================*/

    addClient=(event)=>{

        event.preventDefault();

        const options = event.target.programs.options;
        let opt="";

        let programs = [];
        for(var i=0; i<options.length; i++){
            opt = options[i];
            opt.selected && programs.push(opt.value);
        }

        const newClient = {
            trainerId:"",
            username:event.target.username.value,
            password:event.target.password.value,
            profile:"client",
            status:"active",
            userProfile:{
                fname:event.target.fname.value,
                lname:event.target.lname.value,
                email:event.target.email.value,
                phone:event.target.phone.value,
                address:event.target.address.value,
                city: event.target.city.value,
                province: event.target.province.value,
                country: event.target.country.value
            },
            programs:programs
        }

        axios.post(`http://localhost:8080/trainer/${this.props.match.params.trainerId}/addClient`, newClient)
        .then(res =>{
            console.log(res.data)
            this.setState({clients:[...this.state.clients, res.data]})
        })
        .catch(err=>{
            console.log(err);
        })

    }

    /** ================================================ DELETE CLIENT ================================================*/
        deleteClient=(clientId)=>{
        
        axios.delete(`http://localhost:8080/client/${clientId}`)
        .then(res =>{
            this.props.history.push(`/trainer/${this.props.match.params.username}/${this.props.match.params.trainerId}/clients/${this.state.clients[0].userId}/profile`)
            this.setState({updated:true});//trigger the component did update to pull updated data from db
        })
        .catch(err=>{
            console.log(err);
        })     
    }

    /** ================================================ UPDATE CLIENT ================================================*/
    updateClient=(event)=>{
        event.preventDefault();

        const updatedClient = {
            fname:event.target.fname.value,
            lname:event.target.lname.value,
            email:event.target.email.value,
            phone:event.target.phone.value,
            address:event.target.address.value,
            city: event.target.city.value,
            province: event.target.province.value,
            country: event.target.country.value,
            postal:event.target.postal.value
        }

        axios.put(`http://localhost:8080/client/${this.props.match.params.clientId}/updateDetails`, updatedClient)
        .then(res =>{
            console.log(res);
            //pulls new data from db on component did update
            this.setState({updated:true})
            // this.setState()
        })
        .catch(err=>{
            console.log(err);
        })
    }

    
    /** ================================================ ADD NOTE ================================================*/
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

    updateTrainer=()=>{
        this.setState({updated:true})
    }
  
   
    render(){
 
        const {match} = this.props;
        // console.log(this.state.programs)
        // console.log(this.state.userProfile)
        // console.log(this.state.username);
        // console.log(this.state.trainerId)

        return (
            <>
                {this.state.userProfile && 
                    <SideBar
                        clients={this.state.clients} 
                        programs={this.state.programs} 
                        match={match}
                        trainerId={this.state.trainerId}
                        trainerName={this.state.username}
                        />}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId/programs/:programId") && 
                    <Programs 
                        programs={this.state.programs} 
                        currentProgramId={match.params.programId} 
                        match={match}
                        addProgram={this.addProgram}
                        deleteProgram={this.deleteProgram}
                        addResource={this.addResource} 
                        deleteResource={this.deleteResource}   
                        />}
                {(this.state.clients && match.path==="/trainer/:username/:trainerId/clients/:clientId/profile") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        addNote={this.addNote}
                        addClient={this.addClient}
                        updateClient={this.updateClient}
                        deleteClient={this.deleteClient}
                        updateTrainer={this.updateTrainer}
                    />}
                {(this.state.clients && match.path==="/trainer/:username/:trainerId/clients/:clientId/lessons") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        // addNote={this.addNote}
                        addClient={this.addClient}
                        deleteClient={this.deleteClient}
                        />}
                {(this.state.userProfile && match.path==="/schedule") && <Schedule />}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <User user={this.state.userProfile} updateUserProfile={this.updateUserProfile}/>}
                {/* {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <h1>hello</h1>} */}
                
            </>
        )
    }
}

export default Trainer
