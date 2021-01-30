import React from 'react';

import axios from 'axios';

import './ClientProfile.scss';

import Map from '../../components/Map/Map';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

// props = currentClient
class ClientProfile extends React.Component {
 
    state={currentClient:this.props.currentClient, mapLocation:null}

    componentDidMount(){
        console.log("client profile - did mount")
        this.geoCode();
        this.state.currentClient.programs.forEach(program=>{
            document.getElementById(program.id).checked = true;
        })
    }

    componentDidUpdate(){
        console.log("client profile - did update")
        this.props.programs.forEach(program => {
            document.getElementById(program.id).checked = false;
        })
        this.state.currentClient.programs.forEach(program=>{
            document.getElementById(program.id).checked = true;
        });
        //if the userId currently in state doesn't match the userId in the path then update the currentClient in state to match the one in the path
        if(this.state.currentClient.userId !==this.props.match.params.clientId){
            this.setState({currentClient: this.props.clients.find(client=>client.userId === this.props.match.params.clientId)},()=>{
                this.geoCode();
            });
        } 

    }

    geoCode = () =>{
        const {address, city, province} = this.state.currentClient.userProfile;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=amHyO923YUE511fynEWxbf7Gf5S45VRP&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            // console.log(res.data.results[0].locations[0].displayLatLng);
            this.setState({mapLocation:res.data.results[0].locations[0].displayLatLng});     
        })
        .catch(err=>{
            console.log(err);
        })
       
    }

    addNote=(note)=>{
        // const newNote={message:event.target.newNote.value};
        console.log(note);

        const newNote={
            note:note
        }

        axios.post(`http://localhost:8080/client/${this.state.currentClient.userId}/addNote`, newNote)
        .then(res =>{
            console.log(res.data);
            const copyClient = {...this.state.currentClient};
            copyClient.notes = (res.data);
            this.setState({currentClient:copyClient});
            this.props.updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })

    }

    toggleProgram=(programId)=>{

        console.log(programId)
        
        const program = this.state.currentClient.programs.find((program)=>program.id === programId);
        const index = this.state.currentClient.programs.findIndex((program)=>program.id === programId);

        const copyClient={...this.state.currentClient}

        console.log(program);
        console.log(index);

        // let foundIndex;
        // response.notes.find((note, index) => {foundIndex = index; return note.id === req.params.noteId; });

        if(program){
            document.getElementById(programId).checked=false;
            copyClient.programs.splice(index,1);
            
        }else{
            copyClient.programs.push(this.props.programs.find(program=> programId===program.id))
        }
        
        this.setState({currentClient:copyClient},()=>{
            axios.put(`http://localhost:8080/client/${this.state.currentClient.userId}/updatePrograms`, copyClient.programs)
            .then(res =>{
                this.props.updateTrainer();
            })
            .catch(err=>{
                console.log(err);
            })
        }) 
    }

    render(){
        console.log(this.props.currentClient.programs);
        const {address, city, province, country, postal, email, phone} = this.props.currentClient.userProfile;
        return (
            <>
            <div className="client__programs">
                <p className="client__programs-title">Programs</p>
                <div className="client__programs-list">
                    {this.props.programs.map(program => 
                        <label className="client__programs-label">{program.name}
                            <input onClick={()=>{this.toggleProgram(program.id)}} type="checkbox" name={program.id} id={program.id} value={program.name}/> 
                            <span className="client__programs-check"></span>
                        </label>
                    )}
                </div>
            </div>

            <div className = "client__profile">
                <div className = "component client__contact">
                    <div className="client__contact-info">
                        <div className="client__contact-info-top">
                        <p className="component-title client__contact-title">Contact</p>
                            <div className="client__contact-address"> 
                                <img className="contact-icon"src="/icons/map-marker.svg" alt="address"/>
                                <div>
                                    <p className="client__contact-item"> {address}</p>
                                    <p className="client__contact-item">  {`${city}, ${province}, ${country}`}</p>
                                    <p className="client__contact-item"> {postal}</p>
                                </div>
                            </div>
                            <div className="client__contact-contact">
                                <p className="client__contact-item"><img className="contact-icon" src="/icons/email-icon.svg" alt="email"/> <a href={`mailto:${email}`}> {email}</a></p>
                                <p className="client__contact-item"><img className="contact-icon" src="/icons/phone-icon.svg" alt="phone"/> {phone}</p>
                            </div>
                        </div>
                        <div className="client__contact-modify">
                            <ModalContainer 
                                modalType = "update" 
                                modalName = "updateClient" 
                                buttonType="image"
                                url="/icons/user-edit.svg"
                                onSubmit={this.props.updateClient} 
                                information={this.props.currentClient}
                                />
                        </div>
                    </div>
                    <div className = "client__contact-map">
                        <Map
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                            loadingElement={<div style={{height: "100%"}} />}
                            containerElement={<div style={{height: "100%"}} />}
                            mapElement={<div style={{height: "100%"}} />}
                            mapLocation={this.state.mapLocation}
                        />
                    </div>
                </div>
                <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                    <div className = "client__notes-body">
                        <p className="client__notes-title">Notes to Self ...</p>
                        <div className="client__notes-text"> {this.state.currentClient.notes}</div>
                    </div>
                        <div className="client__notes-submit">
                            <ModalContainer 
                                modalType = "note" 
                                modalName = "addNote" 
                                url="/icons/add-note.svg" 
                                buttonType="image"
                                information = {this.state.currentClient.notes}
                                onSubmit={this.addNote} 
                            />
                        </div>
                    
                </div>
            </div>
            </>
        )
    }
}

export default ClientProfile
