import React, {useState,useEffect} from 'react';
import axios from 'axios';

import "./Client.scss";

import SideBar from '../../components/SideBar/SideBar';
import ClientWelcome from '../ClientWelcome/ClientWelcome';
import Lessons from '../Lessons/Lessons';
import NextLesson from '../NextLesson/NextLesson';
import EmptyPage from '../EmptyPage/EmptyPage';

/**
* Renders the Client side 
* @param {Object} match - used to make axios calls and conditionally render based on the path
*/

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

function Client ({match}) {
    
    //object containing information associated with specified client
    const [client, setClient] = useState(null)
    
    //object containing information for trainer associated with specified client
    const [trainer, setTrainer] = useState(null)
    
    //object containing information for the client's next lesson
    const [nextLesson, setNextLesson] = useState(null);
    
    //array of all the past lessons objects
    const [pastLessons, setPastLessons] = useState(null);
    
    // pull the data from the db and set the results in state
    useEffect(()=>{
        axios.get(`${API_URL}/client/${match.params.clientId}`)
        .then(res =>{
           
            setClient(res.data)
            
            axios.get(`${API_URL}/api/trainer/${res.data.trainerId}`)
            .then(trainerRes=>{
                setTrainer(trainerRes.data.userProfile)
            })

            setNextLesson(res.data.lessons.find(lesson=> lesson.current===true));
            setPastLessons(res.data.lessons.filter(lesson=> lesson.current!==true));
        })
    },[]);

    return (
        <div>
            {/* render the sidebar unconditionally */}
            <SideBar
                nextLesson={nextLesson}
                pastLessons={pastLessons}
                client={client} 
                match={match}
            />

            {/* render the appropriate component based on the specified path */}
            
            {(trainer && match.path==="/client/:clientId") && 
                <ClientWelcome
                    client={client}
                    trainer={trainer}    
                />
            }

            {(client && nextLesson && match.path==="/client/:clientId/nextlesson/:lessonId") && 
                <NextLesson
                    nextLesson={nextLesson}
                />
            }

            {(client && pastLessons && match.path==="/client/:clientId/lessons/:lessonId") && 
                <Lessons
                    pastLessons={pastLessons}
                />
            }

            {(client && match.path==="/client/:clientId/lessons") && <EmptyPage match={match}/>}
        </div>
    )
}

export default Client
