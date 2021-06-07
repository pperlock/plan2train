import {useState, useEffect} from 'react';
import axios from 'axios';

import TrainerContext from './trainer-context';
import {API_URL} from '../App.js';

const TrainerProvider = props =>{

    const [userProfile, setUserProfile] = useState(null);
    const [trainerId, setTrainerId] = useState("");
    const [programs, setPrograms] = useState(null);
    const [clients, setClients] = useState(null);

    useEffect(()=>{
        console.log('trainer-context');
        
        const fetchTrainer = async () =>{
            try{
                const trainerResponse = await axios.get(`${API_URL}/trainer/${trainerId}`);
            setUserProfile(trainerResponse.data.userProfile);
            setPrograms(trainerResponse.data.programs);
            }catch (err){
                console.log(err);
            }

        }

        const fetchClients = async () => {
            try{
                const clientsResponse = await axios.get(`${API_URL}/trainer/${trainerId}/clients`);
                clientsResponse.data.sort((a,b)=>{
                    if(a.userProfile.lname < b.userProfile.lname) return -1;
                    if(a.userProfile.lname > b.userProfile.lname) return 1;
                    return 0;
                })
                setClients(clientsResponse.data);
            }catch (err){
                console.log(err);
            }
        }

        if(!!trainerId){
            fetchTrainer();
            fetchClients();
        }

    },[trainerId]);

    /** ================================================ UPDATE TRAINER ================================================*/
    const updateUserProfile = async (event)=>{
    
        event.preventDefault();

        const {username,fname,lname,password,email,phone,address,city,province,country,postal, facebook, twitter, instagram, linkedIn, companyName, companyDescription} = event.target;

        //create a new user profile based on the information entered into the modal form
        const updatedProfile = {
            contact:{
                username:username.value,
                fname:fname.value,
                lname:lname.value,
                password:password.value,
                email:email.value,
                phone:phone.value,
                address:address.value,
                city: city.value,
                province: province.value,
                country: country.value,
                postal:postal.value
            },
            social:{facebook:facebook.value, twitter:twitter.value, instagram: instagram.value, linkedIn:linkedIn.value},
            company:{
                name:companyName.value,
                description: companyDescription.value,
                //logo is not entered in this form - just use whatever has been stored in state
                logo:userProfile.company.logo
            }
        }

        await axios.put(`${API_URL}/trainer/${trainerId}/updateDetails`, updatedProfile);
        setUserProfile(updatedProfile);
    }

    
    return (
        <TrainerContext.Provider value={{userProfile, setTrainerId, trainerId, updateUserProfile, setUserProfile, programs, setPrograms, clients, setClients}}>
            {props.children}
        </TrainerContext.Provider>
    )
}

export default TrainerProvider;