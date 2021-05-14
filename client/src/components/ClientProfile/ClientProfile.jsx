import React, {useState, useEffect} from 'react';

import axios from 'axios';

import './ClientProfile.scss';

import Map from '../../components/Map/Map';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import {API_URL} from '../../App.js';

/**
 * @param {Object} currentClient  
 * @param {Object} match  
 * @param {Object} programs  
 * @param {Function} updateTrainer  
 * @param {Function} updateClient  
 */


const ClientProfile = ({currentClient, match, programs, updateTrainer, updateClient}) => {

    console.log(currentClient);
    const [mapLocation, setMapLocation] = useState();

    useEffect(()=>{
        
        programs.forEach(program => {
            const inputBox = document.getElementById(program.id);
            if(!!inputBox){inputBox.checked = false};
        })

        currentClient.programs.forEach(program=>{
            const inputBox = document.getElementById(program.id);
            if(!!inputBox){inputBox.checked = true};
        });
        
        //if the userId currently in state doesn't match the userId in the path then update the currentClient in state to match the one in the path
        if(currentClient.userId !== match.params.clientId){
                geoCode();
        }  
    }, [currentClient.userId])

    const geoCode = () =>{
        const {address, city, province} = currentClient.userProfile;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            setMapLocation(res.data.results[0].locations[0].displayLatLng);     
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const addNote=(note)=>{
        const newNote={
            note:note
        }

        axios.post(`${API_URL}/client/${currentClient.userId}/addNote`, newNote)
        .then(res =>{
             updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const toggleProgram=(programId)=>{

        const program = currentClient.programs.find((program)=>program.id === programId);
        const index = currentClient.programs.findIndex((program)=>program.id === programId);

        if(program){
            document.getElementById(programId).checked=false;
            currentClient.programs.splice(index,1);
            
        }else{
            currentClient.programs.push(programs.find(program=> programId===program.id))
        }
        
        axios.put(`${API_URL}/client/${currentClient.userId}/updatePrograms`, currentClient.programs)
        .catch(err=>{
            console.log(err);
        }) 
    }

    const {address, city, province, country, postal, email, phone} = currentClient.userProfile;

    return (
        <>
        <div className="client__programs">
            <p className="client__programs-title">Programs</p>
            <div className="client__programs-list">
                {!!programs && programs.map(program => 
                    <label className="client__programs-label" key={program.id} >{program.name} 
                        <input onClick={()=>{toggleProgram(program.id)}} type="checkbox" name={program.id} id={program.id} value={program.name}/> 
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
                            onSubmit={updateClient} 
                            information={currentClient}
                            />
                    </div>
                </div>
                <div className = "client__contact-map">
                    <Map
                        mapLocation={mapLocation}
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
                        information = {currentClient.notes}
                        onSubmit={addNote} 
                    />
                </div>

                <div className = "client__notes-body">
                    <p className="client__notes-title">Notes to Self ...</p>
                    <div className="client__notes-text"> {currentClient.notes}</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ClientProfile
