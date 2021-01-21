import React from 'react';
import axios from 'axios';
import firebase from '../../firebase';

import "./Trainer.scss"

import SideBar from '../../components/SideBar/SideBar';
import Programs from '../Programs/Programs';
import Clients from '../Clients/Clients';
import Schedule from '../Schedule/Schedule';
import User from '../User/User';

class Trainer extends React.Component{
    
    state={files:null, username:"bharwood", trainerId: "600616b6c63ec047da27d59f", userProfile:null, programs:null, clients:null}


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
        // console.log("trainer-componentDidMount")
    }

    /** ================================================ ADD CLIENT ================================================*/

    addClient=(newClient)=>{

        axios.post(`http://localhost:8080/trainer/${this.state.userProfile[0].userId}/addClient`, newClient)
        .then(res =>{
            this.setState({clients:[...this.state.clients, res.data]})
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ ADD PROGRAM ================================================*/
    addProgram=(newProgram)=>{
        console.log(newProgram)
        axios.post(`http://localhost:8080/trainer/${this.state.userProfile[0].userId}/addProgram`, newProgram)
        .then(res =>{
            this.setState({programs:[...this.state.programs, res.data]})
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    /** ================================================ UPDATE USER ================================================*/
    updateUserProfile=(updatedProfile)=>{
        this.setState({userProfile:updatedProfile});
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

    fileSelectedHandler = event =>{
        //first item in the array will be the file added
        this.setState({files:event.target.files});
    }

    fileUpload=()=>{
        // const fd=new FormData; //default js object
        // //image can be any name you want -pdf, video, etc       
        // fd.append('image', this.state.selectedFile, this.state.selectedFile.name )
        // axios.post('link to cloud storage', fd, {
        //     onUploadProgress:progressEvent =>{
        //         console.log('Upload Progress:' + Math.round((progressEvent.loaded/progressEvent.total)*100) + '%')
        //     }
        // })//fd is the data to send with the request, third argument for progress
        // .then(res=>{
        //     console.log(res);
        // })
        // .catch(err=>{
        //     console.log(err);
        // })
        
        let bucketName = "resources";
        let file = this.state.files[0];
        console.log(file);
        let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
        let uploadTask = storageRef.put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{
                let downloadURL = uploadTask.snapshot.getDownloadURL;
            })
        
        // retrieving the file storage ref
            //let storageRef = firebase.storage().ref();
            let spaceRef = storageRef.child('/resources/'+ this.state.files[0].name);
            storageRef.child('/resources/'+this.state.files[0].name).getDownloadURL()
            .then((url)=>{
                console.log(url)
            })
            .catch(err=>{
                console.log(err);
            })

    }
    
    render(){
 
        const {match} = this.props;

        return (
            <>
                {/* a reference is a way to reference another element in the dom */}
                {/* ref takes a function that binds a property of our class to a reference of this input */}
                <input 
                    style={{display:'none'}} 
                    type="file"
                    onChange={this.fileSelectedHandler} 
                    ref={fileInput => this.fileInput=fileInput}>
                </input>
                <button onClick={()=>this.fileInput.click()}>Choose File</button>
                <button onClick={this.fileUpload}>Upload</button>

                {this.state.userProfile && 
                    <SideBar
                        clients={this.state.clients} 
                        programs={this.state.programs} 
                        match={match}
                        trainerId={this.state.trainerId}
                        trainerName={this.state.username}
                        />}
                {(this.state.userProfile && match.path==="/programs/:programId") && 
                    <Programs 
                        programs={this.state.programs} 
                        currentProgramId={match.params.programId} 
                        match={match}
                        addProgram={this.addProgram}    
                        />}
                {(this.state.clients && match.path==="/clients/:clientId/profile") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        addNote={this.addNote}
                        addClient={this.addClient}
                    />}
                {(this.state.clients && match.path==="/clients/:clientId/lessons") && 
                    <Clients {...this.props} 
                        programs={this.state.programs} 
                        clients={this.state.clients} 
                        // addNote={this.addNote}
                        addClient={this.addClient}
                        />}
                {(this.state.userProfile && match.path==="/schedule") && <Schedule />}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <User user={this.state.userProfile} updateUserProfile={this.updateUserProfile}/>}
                {(this.state.userProfile && match.path==="/trainer/:username/:trainerId") && <h1>hello</h1>}
                
            </>
        )
    }
}

export default Trainer
