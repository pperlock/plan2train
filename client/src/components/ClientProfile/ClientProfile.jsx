import React from 'react';

import axios from 'axios';

import './ClientProfile.scss';

import List from '../../components/List/List';
import Map from '../../components/Map/Map';

// props = currentClient
class ClientProfile extends React.Component {
 
    state={currentClient:this.props.currentClient, mapLocation:null}

    componentDidMount(){
        this.geoCode();
    }

    componentDidUpdate(){
        // console.log("client - did update")
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
            console.log(res.data.results[0].locations[0].displayLatLng);
            this.setState({mapLocation:res.data.results[0].locations[0].displayLatLng});     
        })
        .catch(err=>{
            console.log(err);
        })
       
    }

    addNote=(event)=>{
        event.preventDefault();
        const newNote={message:event.target.newNote.value};

        axios.post(`http://localhost:8080/client/${this.state.currentClient.userId}/addNote`, newNote)
        .then(res =>{
            console.log(res.data);
            const copyClient = {...this.state.currentClient};
            copyClient.notes.push(res.data);
            this.setState({currentClient:copyClient});
            event.target.newNote.value="";
            this.props.updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })

    }

    deleteNote=(noteId)=>{
        axios.delete(`http://localhost:8080/client/${this.state.currentClient.userId}/${noteId}/deleteNote`)
        .then(res =>{
            console.log(noteId);
            const copyClient = {...this.state.currentClient};
            copyClient.notes = res.data;
            this.setState({currentClient:copyClient});
            this.props.updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render(){
        const {address, city, province, country, postal, email, phone} = this.state.currentClient.userProfile;
        return (
            <div className = "client__middle">
                <div className = "component client__contact">
                    <div className="client__contact-info">
                        <div className="client__contact-info-top">
                            <div className="client__contact-address"> 
                                <p className="component-title client__contact-title">Contact</p>
                                <p className="client__contact-item"> {address}</p>
                                <p className="client__contact-item"> {city}</p>
                                <p className="client__contact-item"> {`${province},  ${country}`}</p>
                                <p className="client__contact-item"> {postal}</p>
                            </div>
                            <div className="client__contact-contact">
                                <p className="client__contact-item"> {email}</p>
                                <p className="client__contact-item"> {phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className = "client__contact-map" style={{width:"346px", height:"253px"}}>
                            <Map
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                                loadingElement={<div style={{height: "100%"}} />}
                                containerElement={<div style={{height: "100%"}} />}
                                mapElement={<div style={{height: "100%"}} />}
                                mapLocation={this.state.mapLocation}
                            />
                    </div>
                </div>

                <div className = "component client__notes">
                    <p className="component-title">Notes</p>
                    <div className="list">
                        {this.state.currentClient.notes.map(note=> 
                            <List 
                                key={note.id} 
                                content={note.message} 
                                id={note.id} 
                                deleteFunction = {this.deleteNote} 
                                deleteBtn={true}
                                deleteType="modal"
                            />)}
                    </div>
                    <form className="client__notes-form" onSubmit={(event)=>this.addNote(event)}>
                        <input className="client__notes-new" type="text" name="newNote" placeholder="New Note"></input>
                        <button className=" add client__notes-add"> + </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default ClientProfile
