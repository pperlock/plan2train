import React, {useEffect, useContext} from 'react';

import "./Trainer.scss"

import User from '../User/User';

import TrainerContext from '../../store/trainer-context';

/**
 * @param {Object} props - used to access the username and trainer id from the url
 * 
 * @param {String} selectedFile - file selected to update trainer logo
 */

const Trainer = ({match}) => {

    const {userProfile, setTrainerId, updateUserProfile} = useContext(TrainerContext);

    useEffect(()=>{
        setTrainerId(match.params.trainerId);
    },[match.params.trainerId, setTrainerId])
    
    return (
        <>
            {userProfile &&  
                <User 
                    user={userProfile} 
                    updateUserProfile={updateUserProfile} 
                    match={match} 
                />
            }
        </>
    )
}

export default Trainer
