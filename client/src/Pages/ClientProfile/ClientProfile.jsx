import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import './ClientProfile.scss';

import Map from '../../components/Map/Map';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import ClientNav from '../../components/ClientNav/ClientNav';
import PageLayout from '../../components/PageLayout/PageLayout';

import {API_URL} from '../../App.js';

import TrainerContext from '../../store/trainer-context';

const ClientProfile = () => {

    const {clients, setClients, programs, setTrainerId} = useContext(TrainerContext);
    
    const {clientId, trainerId} = useParams();

    const [mapLocation, setMapLocation] = useState();

    const [currentClient, setCurrentClient] = useState(null);

    useEffect(()=>{
        console.log('client profile loaded');
        !!clients && setCurrentClient(clients.find(client => client.userId === clientId));
        setTrainerId(trainerId);
        
        if(programs){
            programs.forEach(program => {
                const inputBox = document.getElementById(program.id);
                if(!!inputBox){inputBox.checked = false};
            })

            if (currentClient){
                currentClient.programs.forEach(program=>{
                    const inputBox = document.getElementById(program.id);
                    if(!!inputBox){inputBox.checked = true};
                });
            }
        }
        
        //if the userId currently in state doesn't match the userId in the path then update the currentClient in state to match the one in the path
        if (currentClient){
            if(currentClient.userId !== clientId){
                geoCode();
            }  
        }
    }, [programs, clients, clientId, currentClient, setCurrentClient])

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
            const clientLoc = clients.findIndex(client => client.userId === clientId);
            const clientCopy=[...clients];
            clientCopy.splice(clientLoc, 1 ,res.data);
            setClients(clientCopy);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const toggleProgram=(programId)=>{

        const currentPrograms = currentClient.programs;
        const program = currentPrograms.find((program)=>program.id === programId);
        const index = currentPrograms.findIndex((program)=>program.id === programId);

        if(program){
            document.getElementById(programId).checked=false;
            currentPrograms.splice(index,1);
            
        }else{
            currentPrograms.push(programs.find(program=> programId===program.id))
        }
        
        axios.put(`${API_URL}/client/${currentClient.userId}/updatePrograms`, currentPrograms)
        .catch(err=>{
            console.log(err);
        }) 
    }

    /** ================================================ UPDATE CLIENT ================================================*/
    const updateClient=(event)=>{
        event.preventDefault();

        const {fname, lname, email, phone, address, city, province, country, postal} = event.target;
        
        //create a new client object using the input information from the form
        const updatedClient = {
            fname:fname.value,
            lname:lname.value,
            email:email.value,
            phone:phone.value,
            address:address.value,
            city: city.value,
            province: province.value,
            country: country.value,
            postal:postal.value
        }

        // send the new client information to the db and update the state to pull from the db
        axios.put(`${API_URL}/client/${clientId}/updateDetails`, updatedClient)
        .then(res =>{
            console.log(res);
            const clientLoc = clients.findIndex(client => client.userId === clientId);
            const clientCopy=[...clients];
            clientCopy.splice(clientLoc,1,res.data);
            clientCopy.sort((a,b)=>{
                if(a.userProfile.lname < b.userProfile.lname) return -1;
                if(a.userProfile.lname > b.userProfile.lname) return 1;
                return 0;
            })
            setClients(clientCopy);
           })
        .catch(err=>{
            console.log(err);
        })
    }
    
    const {address, city, province, country, postal, email, phone} = currentClient ? currentClient.userProfile : {};

    return (
        <>
        {clients && <PageLayout> 
            <ClientNav/>
            <div className="client__profile-container">
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
                    {currentClient &&
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
                    }
                </div>

        </PageLayout> 
        }
        </>
    )
}

export default ClientProfile
