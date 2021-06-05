import React, {useState,useEffect} from 'react';
import {useParams, useRouteMatch} from 'react-router-dom';
import axios from 'axios';

import "./Client.scss";

import ClientWelcome from '../ClientWelcome/ClientWelcome';
import Lessons from '../Lessons/Lessons';
import NextLesson from '../NextLesson/NextLesson';
import EmptyPage from '../EmptyPage/EmptyPage';
import {API_URL} from '../../App.js';


function Client () {

    const {clientId} = useParams();
    const {path} = useRouteMatch();
    
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
        axios.get(`${API_URL}/api/client/${clientId}`)
        .then(res =>{
           
            setClient(res.data)
            
            axios.get(`${API_URL}/api/trainer/${res.data.trainerId}`)
            .then(trainerRes=>{
                setTrainer(trainerRes.data.userProfile)
            })

            setNextLesson(res.data.lessons.find(lesson=> lesson.current===true));
            setPastLessons(res.data.lessons.filter(lesson=> lesson.current!==true));
        })
    },[clientId]);

    return (
        <div>

            {/* render the appropriate component based on the specified path */}
            
            {(trainer && path==="/client/:clientId") && 
                <ClientWelcome
                    client={client}
                    trainer={trainer}    
                />
            }

            {(client && nextLesson && path==="/client/:clientId/nextlesson/:lessonId") && 
                <NextLesson
                    nextLesson={nextLesson}
                />
            }

            {(client && pastLessons && path==="/client/:clientId/lessons/:lessonId") && 
                <Lessons
                    pastLessons={pastLessons}
                />
            }

            {(client && path==="/client/:clientId/lessons") && <EmptyPage />}
        </div>
    )
}

export default Client
