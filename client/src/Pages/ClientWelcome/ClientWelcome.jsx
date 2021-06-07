import React, {useState,useEffect}from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {API_URL} from '../../App.js';

import './ClientWelcome.scss';

import Map from '../../components/Map/Map';

function ClientWelcome() {

    const {clientId} = useParams();

    //object containing information associated with specified client
    const [client, setClient] = useState(null);
    
    //object containing information for trainer associated with specified client
    const [trainer, setTrainer] = useState(null);

    //store the geocoded maplocation in state
    const [mapLocation, setMapLocation]=useState(null);

    useEffect(()=>{

        const fetchClient = async () =>{
            try{
                const clientRes = await axios.get(`${API_URL}/client/${clientId}`)
                const trainerRes = await axios.get(`${API_URL}/trainer/${clientRes.data.trainerId}`);
                setClient(clientRes.data);
                setTrainer(trainerRes.data.userProfile)
            }catch (err){
                console.log(err);
            }
        }

        fetchClient();

        const getMapLocation = async () =>{
            try{
            const mapRes = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`);
            setMapLocation(mapRes.data.results[0].locations[0].displayLatLng);
            }catch (err){
                console.log(err);
            }
        }

        // getMapLocation();
       
    },[]);

    const {lname,fname,email,phone,address,city,province,country,postal} = !!trainer ? trainer.contact : {};
    const {facebook, twitter, instagram, linkedIn} = !!trainer ? trainer.social : {};
    const {name, description, logo} = !!trainer ? trainer.company : {};

    return (
        <>
        {client && 
            <div className="welcome" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                <div className="welcome__greeting">
                    <h1 className="welcome__greeting-welcome">WELCOME</h1>
                    <h1 className="welcome__greeting-client">{`${client.userProfile.fname}!`} </h1>
                </div>
                
                {/* renders trainer's company information */}
                <div className="component welcome__section">
                    <div className="component-title welcome__section-title">
                        <p>Company</p>
                    </div> 
                    <div className="welcome__section-body welcome__section-company ">
                            {logo !=="" && <div className="welcome__section-company-logo"><img src={logo} alt ="company logo" className="user-profile__description-logo"/></div>}
                            <div className="welcome__section-company-text">
                                <p className="welcome__section-company-name">{name}</p>
                                <p className="welcome__section-company-description">{description}</p>
                            </div>
                    </div>
                </div>    

                {/* renders client's programs */}
                <div className="component welcome__section ">    
                        <div className="component-title welcome__section-title">
                            <p>Programs</p>
                        </div>
                        <div className="welcome__section-body welcome__programs">
                            {client.programs.map(program=>
                                <div key={program.id}>
                                    <p className="welcome__programs-title">{program.name}</p>
                                    <p className="welcome__programs-text">{program.description}</p>
                                </div>
                            )}
                        </div>
                </div>  

                {/* renders the trainer's contact information */}
                <div className="component welcome__section welcome__section--last">
                    <div className="component-title welcome__section-title">
                        <p>Trainer</p>
                    </div>  
                    <div className="welcome__section-body">
                        <div className="user-profile__details">
                            <div className="user-profile__contact">
                                <p className="user-label user-profile__contact-title"> CONTACT YOUR TRAINER </p> 
                                <div className="user-profile-item">
                                    <img className="contact-icon" src="/icons/user-profile-icon.svg" alt="trainer"/><p>{`${fname} ${lname}`}</p>
                                </div>
                                <div className="user-profile-item">
                                    <img className="contact-icon" src="/icons/email-icon.svg" alt="email"/><a className="contact-link" href={`mailto:${email}`}> {email}</a>
                                </div>
                                <div className="user-profile-item">
                                    <img className="contact-icon" src="/icons/phone-icon.svg" alt="phone number"/><p>{phone}</p>
                                </div>

                                <div className="user-profile__social">
                                    <a href={facebook}><img className="contact-icon--social" rel="noopener noreferrer" src="/icons/facebook-icon.svg" alt="facebook"/></a>
                                    <a href={twitter}><img className="contact-icon--social" rel="noopener noreferrer" src="/icons/twitter-icon.svg" alt="twitter"/></a>
                                    <a href={instagram}><img className="contact-icon--social" rel="noopener noreferrer" src="/icons/instagram-icon.svg" alt="instagram"/></a>
                                    <a href={linkedIn}><img className="contact-icon--social" rel="noopener noreferrer" src="/icons/linkedin-icon.svg" alt="linked-in"/></a>
                                </div>
                            </div>
                            <div className="user-profile__address welcome__trainer-address">
                                <div>
                                    <p className="user-label user-profile__address-title">FIND YOUR TRAINER</p>
                                    <p className="user-profile__address-item">{address}</p>
                                    <p className="user-profile__address-item">{`${city}, ${province}, ${country}`}</p>
                                    <p className="user-profile__address-item">{postal}</p>
                                </div>
                                {/* renders a map of the trainer's geocoded location */}
                                <div className = "welcome__map">
                                    <Map
                                        mapLocation={mapLocation}
                                        containerSize={{width:"346px", height:"211px"}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default ClientWelcome
