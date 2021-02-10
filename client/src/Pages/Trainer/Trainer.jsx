import React from 'react';
import axios from 'axios';

import "./Trainer.scss"

import SideBar from '../../components/SideBar/SideBar';
import Programs from '../Programs/Programs';
import Clients from '../Clients/Clients';
import Schedule from '../Schedule/Schedule';
import User from '../User/User';
import EmptyPage from '../EmptyPage/EmptyPage';

/**
 * @param {Object} props - used to access the username and trainer id from the url
 * 
 * STATE
 * @param {String} username
 * @param {String} trainerId
 * @param {Object} userProfile - contains all the contact/compnay information for the trainer
 * @param {Array} clients - contains an array of client objects associated with the trainer
 * @param {String} updated - used to update the trainer app where necessary
 * @param {String} selectedFile - file selected to update trainer logo
 */

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

class Trainer extends React.Component{
    
    state={files:null, 
            username:this.props.match.params.username, 
            trainerId: this.props.match.params.trainerId, 
            userProfile:null, 
            programs:[], 
            clients:[], 
            updated:false, 
            empty:false, 
            selectedFile:null}


    componentDidMount(){
        console.log(`${API_URL}/trainer/${this.state.trainerId}`);
       //get the trainer's information and their associated clients from the db when the component is mounted
        axios.get(`${API_URL}/trainer/${this.state.trainerId}`)
        .then(res =>{
            this.setState({userProfile:res.data.userProfile, programs:res.data.programs},()=>{
                axios.get(`${API_URL}/trainer/${this.state.trainerId}/clients`)
                .then(clientRes=>{
                    this.setState({clients:clientRes.data})
                })
                .catch(clientErr =>{
                    console.log(clientErr);
                })
            })
        })
        .catch(err =>{
            console.log(err);
        })
    }

    componentDidUpdate(){
        //get the trainer's information and their associated clients from the db when the component is updated
        if(this.state.updated){
            axios.get(`${API_URL}/trainer/${this.state.trainerId}`)
            .then(res =>{
                console.log(res);
                this.setState({userProfile:res.data.userProfile, programs:res.data.programs},()=>{
                    axios.get(`${API_URL}/trainer/${this.props.match.params.trainerId}/clients`)
                    .then(clientRes=>{
                        console.log(clientRes);
                        this.setState({clients:clientRes.data})
                    })
                    .catch(clientErr =>{
                        console.log(clientErr);
                    })
                })
                // if the update is fired by another component then set updated back to false
                this.setState({updated:false})
            })
            .catch(err=>{
                console.log(err)        
            })
        }
    }

    /** ================================================ UPDATE TRAINER ================================================*/
    updateUserProfile=(event)=>{
        
        event.preventDefault();

        //create a new user profile based on the information entered into the modal form
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
                description: event.target.companyDescription.value,
                //logo is not entered in this form - just use whatever has been stored in state
                logo:this.state.userProfile.company.logo
            }
        }

        //send a request to the db to save the new information and set it in state
        axios.put(`${API_URL}/trainer/${this.props.match.params.trainerId}/updateDetails`, updatedProfile)
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

        //create a new program based on the information entered into the modal form - id is created on backend
        const newProgram = {
            name:event.target.programName.value,
            description:event.target.programDescription.value
        }

        //send a request to the db to save the new information and set it in state using the returned information
        axios.post(`${API_URL}/trainer/${this.props.match.params.trainerId}/addProgram`, newProgram)
        .then(res =>{
            this.setState({programs:[...this.state.programs, res.data]},()=>{
                // direct the user to the new program page
                this.props.history.push(`/trainer/${this.props.match.params.trainerId}/programs/${res.data.id}`)
            })
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ UPDATE PROGRAM ================================================*/
    updateProgram=(event)=>{

        event.preventDefault();
        
        //create a new program based on the information entered into the modal form
        const newProgram = {
            name:event.target.programName.value,
            description:event.target.programDescription.value
        }

        //send a request to the db to save the new information - trigger an update of the component to fetch the new data       
        axios.post(`${API_URL}/trainer/${this.props.match.params.trainerId}/${this.props.match.params.programId}/updateProgram`, newProgram)
        .then(res =>{
            this.setState({updated:true})
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ DELETE PROGRAM ================================================*/
    deleteProgram = (programId) =>{

        // send a request to the db to delete a program with the specified programId
        axios.delete(`${API_URL}/program/${this.props.match.params.programId}`)
        .then(res =>{
            //trigger the state to update the component and the redirect the user to the first program on the list
            this.setState({updated:true},()=>{
                //if the program removed is the only program then send the user to the empty page
                if((this.state.programs.length - 1) === 0){
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/programs`)
                }else{
                    //if the program on the list was the first on on the list send it to the program at index 1 otherwise index 0
                    const programLoc = this.state.programs.findIndex(program => program.id === programId);
                    programLoc !== 0 ? 
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/programs/${this.state.programs[0].id}`)
                    :
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/programs/${this.state.programs[1].id}`)
                }
            });
        })
        .catch(err=>{
            console.log(err);
        }) 
    }

    /** ================================================ ADD RESOURCE ================================================*/
    addResource=(newResource)=>{
        //a new resources is made in the programs component and passed back to trainer to save in the db
        axios.post(`${API_URL}/program/${this.props.match.params.programId}/addResource`, newResource)
        .then(res =>{
            this.setState({updated:true});//trigger the component did update to pull updated data from db
        })
        .catch(err=>{
            console.log(err);
        })
    }

    /** ================================================ DELETE RESOURCE ================================================*/
    deleteResource = (resourceId) =>{
        //a resourceId is sent back from the programs component and removed from the db
        axios.delete(`${API_URL}/program/${this.props.match.params.programId}/${resourceId}`)
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

        // get the list of selected programs from the selection element
        const options = event.target.programs.options;
        let opt="";
        let programs = [];
        for(var i=0; i<options.length; i++){
            opt = options[i];
            const program = this.state.programs.find(program=> program.id===opt.value);
            opt.selected && programs.push(program);
        }

        // create a new client to send to the db using form input values- trainerId is applied and userid is created on the backend
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
            //use the selected programs from above
            programs:programs
        }

        // save the new client in the db and return send the user to the new clients profile page
        axios.post(`${API_URL}/trainer/${this.props.match.params.trainerId}/addClient`, newClient)
        .then(res =>{
            this.setState({clients:[...this.state.clients, res.data]},()=>{
                this.props.history.push(`/trainer/${this.props.match.params.trainerId}/clients/${res.data.userId}/profile`)
            })
        })
        .catch(err=>{
            console.log(err);
        })

    }

    /** ================================================ DELETE CLIENT ================================================*/
    deleteClient=(clientId)=>{

       // send a request to the db to delete a client with the specified programId
        axios.delete(`${API_URL}/client/${clientId}`)
        .then(res =>{
            //trigger the state to update the component and the redirect the user to the appropriate client
            this.setState({updated:true},()=>{
                //if the client removed was the only one on the list send the user to the empty clients page
                if((this.state.clients.length - 1) === 0){
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/clients`)
                }else{
                    const programLoc = this.state.clients.findIndex(client => client.userId === clientId);
                    //send the user to the first client on the list unless the one removed was at 0 index, the route to client at index 1
                    programLoc !== 0 ? 
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/clients/${this.state.clients[0].userId}/profile`)
                    :
                    this.props.history.push(`/trainer/${this.props.match.params.trainerId}/clients/${this.state.clients[1].userId}/profile`)
                }
            });
        })
        .catch(err=>{
            console.log(err);
        })     
    }

    /** ================================================ UPDATE CLIENT ================================================*/
    updateClient=(event)=>{
        event.preventDefault();
        
        //create a new client object using the input information from the form
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

        // send the new client information to the db and update the state to pull from the db
        axios.put(`${API_URL}/client/${this.props.match.params.clientId}/updateDetails`, updatedClient)
        .then(res =>{
            //pulls new data from db on component did update
            this.setState({updated:true})
           })
        .catch(err=>{
            console.log(err);
        })
    }

    //used to update the state and trigger a pull from the db when data is created,updated, or deleted
    updateTrainer=()=>{
        this.setState({updated:true})
    }
  
   
    render(){
        const {match} = this.props;
        console.log(this.state.userProfile);
        return (
            <>
                {/* render the sidebar for all instances */}
                {this.state.userProfile &&  
                    <SideBar
                        clients={this.state.clients} 
                        programs={this.state.programs} 
                        match={match}
                        trainerId={this.state.trainerId}
                        trainerName={this.state.username}
                        history={this.props.history}
                    />}
                {/* render an empty page alerting the user to add programs based on the path */}
                {(this.state.userProfile && match.path==="/trainer/:trainerId/programs") && 
                    <EmptyPage 
                        match={match}
                        list={this.state.programs} 
                        onSubmit={this.addProgram}
                        programs={this.state.programs}
                    />}

                {/* render an empty page alerting the user to add clients based on the path */}
                {(this.state.userProfile && match.path==="/trainer/:trainerId/clients") && 
                    <EmptyPage 
                        match={match}
                        list={this.state.clients}
                        onSubmit={this.addClient}
                        programs={this.state.programs}
                    />}
                
                {/* render the program, clients or user components based on the path */}

                {(this.state.userProfile && match.path==="/trainer/:trainerId/programs/:programId") && 
                    <Programs 
                        programs={this.state.programs} 
                        currentProgramId={match.params.programId} 
                        match={match}
                        addProgram={this.addProgram}
                        deleteProgram={this.deleteProgram}
                        addResource={this.addResource} 
                        deleteResource={this.deleteResource}  
                        updateProgram={this.updateProgram} 
                    />}

                {(this.state.clients && this.state.clients.length !== 0 && match.path==="/trainer/:trainerId/clients/:clientId/profile") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        addNote={this.addNote}
                        addClient={this.addClient}
                        updateClient={this.updateClient}
                        deleteClient={this.deleteClient}
                        updateTrainer={this.updateTrainer}
                    />}

                {(this.state.clients  && this.state.clients.length !== 0 && match.path==="/trainer/:trainerId/clients/:clientId/lessons") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        addClient={this.addClient}
                        deleteClient={this.deleteClient}
                        />}
                
                {(this.state.userProfile && match.path==="/trainer/:trainerId") && 
                    <User 
                        user={this.state.userProfile} 
                        updateUserProfile={this.updateUserProfile} 
                        match={match} 
                        updateTrainer={this.updateTrainer} 
                    />}
                
                {(this.state.userProfile && match.path==="/schedule") && <Schedule />}
            </>
        )
    }
}

export default Trainer
