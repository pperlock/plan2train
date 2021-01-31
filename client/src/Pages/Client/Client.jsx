import React, {useState,useEffect} from 'react';
import axios from 'axios';

import SideBar from '../../components/SideBar/SideBar';
import ClientWelcome from '../ClientWelcome/ClientWelcome';
import Lessons from '../Lessons/Lessons';
import NextLesson from '../NextLesson/NextLesson';
import EmptyPage from '../EmptyPage/EmptyPage';


import "./Client.scss";

function Client ({match}) {
    
    const [client, setClient] = useState(null)
    const [trainer, setTrainer] = useState(null)
    const [nextLesson, setNextLesson] = useState(null);
    const [pastLessons, setPastLessons] = useState(null);
    
    useEffect(()=>{
        axios.get(`http://localhost:8080/client/${match.params.username}/${match.params.clientId}`)
        .then(res =>{
           
            setClient(res.data)
            
            axios.get(`http://localhost:8080/trainer/${res.data.trainerId}`)
            .then(trainerRes=>{
                setTrainer(trainerRes.data.userProfile)
            })

            setNextLesson(res.data.lessons.find(lesson=> lesson.current===true));
            setPastLessons(res.data.lessons.filter(lesson=> lesson.current!==true));
        })
    },[]);

    trainer && console.log(client);
    trainer && console.log(nextLesson);
    trainer && console.log(pastLessons);
    trainer && console.log(trainer);
    return (
        <div>

            <SideBar
                nextLesson={nextLesson}
                pastLessons={pastLessons}
                client={client} 
                match={match}
            />

            {(trainer && match.path==="/client/:username/:clientId") && 
                <ClientWelcome
                    client={client}
                    trainer={trainer}    
                />
            }

            {(client && nextLesson && match.path==="/client/:username/:clientId/nextlesson/:lessonId") && 
                <NextLesson
                    nextLesson={nextLesson}
                />
            }

            {(client && pastLessons && match.path==="/client/:username/:clientId/lessons/:lessonId") && 
                <Lessons
                    pastLessons={pastLessons}
                />
            }

            {(client && match.path==="/client/:username/:clientId/lessons") && <EmptyPage match={match}/>}
        </div>
    )
}

export default Client
