import React from 'react';

import axios from 'axios';

import './ClientProfile.scss';

import Map from '../../components/Map/Map';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com/': 'http://localhost:8080';

// props = currentClient
class ClientProfile extends React.Component {
 
    state={currentClient:this.props.currentClient, mapLocation:null}

    componentDidMount(){
        console.log("client profile - did mount")
        this.geoCode();
        this.state.currentClient.programs.forEach(program=>{
            const inputBox = document.getElementById(program.id);
            if(!!inputBox){inputBox.checked = true};
        })
    }

    componentDidUpdate(prevState,prevProps){
        const {address, city, province} = this.state.currentClient.userProfile;
        console.log("client profile - did update")
        this.props.programs.forEach(program => {
            const inputBox = document.getElementById(program.id);
            if(!!inputBox){inputBox.checked = false};
        })
        this.state.currentClient.programs.forEach(program=>{
            const inputBox = document.getElementById(program.id);
            if(!!inputBox){inputBox.checked = true};
        });
        //if the userId currently in state doesn't match the userId in the path then update the currentClient in state to match the one in the path
        if(this.state.currentClient.userId !==this.props.match.params.clientId){
            this.setState({currentClient: this.props.clients.find(client=>client.userId === this.props.match.params.clientId)},()=>{
                this.geoCode();
            });
        }
        
        if(city !== prevState.currentClient.userProfile.city || address !== prevProps.currentClient.userProfile.address || province !== prevProps.currentClient.userProfile.province){
            // this.geoCode();
        }

    }

    geoCode = () =>{
        const {address, city, province} = this.state.currentClient.userProfile;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            // console.log(res.data.results[0].locations[0].displayLatLng);
            this.setState({mapLocation:res.data.results[0].locations[0].displayLatLng});     
        })
        .catch(err=>{
            console.log(err);
        })
       
    }

    addNote=(note)=>{
        const newNote={
            note:note
        }
        axios.post(`${API_URL}/client/${this.state.currentClient.userId}/addNote`, newNote)
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

        if(program){
            document.getElementById(programId).checked=false;
            copyClient.programs.splice(index,1);
            
        }else{
            copyClient.programs.push(this.props.programs.find(program=> programId===program.id))
        }
        
        this.setState({currentClient:copyClient},()=>{
            axios.put(`${API_URL}/client/${this.state.currentClient.userId}/updatePrograms`, copyClient.programs)
            .then(res =>{
                this.props.updateTrainer();
            })
            .catch(err=>{
                console.log(err);
            })
        }) 
    }

    render(){
        // console.log(this.props.currentClient.programs);
        const {address, city, province, country, postal, email, phone} = this.props.currentClient.userProfile;
        return (
            <>
            <div className="client__programs">
                <p className="client__programs-title">Programs</p>
                <div className="client__programs-list">
                    {this.props.programs.map(program => 
                        <label className="client__programs-label" key={program.id} >{program.name} 
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
                                <p className="client__contact-item client__contact-item--email"><img className="contact-icon" src="/icons/email-icon.svg" alt="email"/> <a href={`mailto:${email}`}> {email}</a></p>
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
                            mapLocation={this.state.mapLocation}
                            containerSize={{width:"386px", height:"200px"}}
                        />
                    </div>
                </div>
                <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
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

                    <div className = "client__notes-body">
                        <p className="client__notes-title">Notes to Self ...</p>
                        <div className="client__notes-text"> {this.state.currentClient.notes}</div>
                    </div>
              </div>
            </div>
            </>
        )
    }
}

export default ClientProfile
