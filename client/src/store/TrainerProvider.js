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
        //get the trainer's information and their associated clients from the db when the component is mounted
        if(!!trainerId){
            axios.get(`${API_URL}/trainer/${trainerId}`)
            .then(res =>{
                console.log('reached');
                setUserProfile(res.data.userProfile);
                setPrograms(res.data.programs);
            })
            .catch(err =>{
                console.log(err);
            })

            axios.get(`${API_URL}/trainer/${trainerId}/clients`)
            .then(res=>{
                res.data.sort((a,b)=>{
                    if(a.userProfile.lname < b.userProfile.lname) return -1;
                    if(a.userProfile.lname > b.userProfile.lname) return 1;
                    return 0;
                })
                setClients(res.data)
            })
            .catch(err =>{
                console.log(err);
            }) 
        }
    },[trainerId]);

    /** ================================================ UPDATE TRAINER ================================================*/
    const updateUserProfile=(event)=>{
    
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

        //send a request to the db to save the new information and set it in state
        axios.put(`${API_URL}/trainer/${trainerId}/updateDetails`, updatedProfile)
        .then(res =>{
            setUserProfile(updatedProfile);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    
    return (
        <TrainerContext.Provider value={{userProfile, setTrainerId, trainerId, updateUserProfile, setUserProfile, programs, setPrograms, clients, setClients}}>
            {props.children}
        </TrainerContext.Provider>
    )
}

export default TrainerProvider;