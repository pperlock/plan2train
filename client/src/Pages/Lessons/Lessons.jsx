import React, {useState,useEffect}from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {API_URL} from '../../App.js';

import "./Lessons.scss";
import '../NextLesson/NextLesson.scss';

import GridList from '../../components/GridList/GridList';
import EmptyPage from '../../Pages/EmptyPage/EmptyPage';

function Lessons() {

    console.log('lessons reached')
    //set the selected lesson in state and default it to the first lesson in the array
    const [selectedLesson, setSelectedLesson]= useState(null);

    const [pastLessons, setPastLessons] = useState(null);

    const {clientId} = useParams();

    useEffect(()=>{
        axios.get(`${API_URL}/client/${clientId}`)
        .then(res =>{
            const filteredPast = res.data.lessons.filter(lesson=> lesson.current!==true);
            setPastLessons(filteredPast);
            return filteredPast
        })
        .then(res2 =>{
            setSelectedLesson(res2[0])
        })
        .catch(err => {
            console.log(err)
        })
        
    },[clientId]);

    //changes the lesson being rendered when a lesson is clicked from top list
    const showLesson = (lessonId) =>{
        const selectedLesson = pastLessons.find(lesson => lesson.id === lessonId);
        setSelectedLesson(selectedLesson);
    }

    if(!!pastLessons && pastLessons.length===0){
        return <EmptyPage/>
    }

    return (
        <div className="next-lesson" style={{backgroundImage: "url('/images/main2.jfif')"}}>

            <h1 className="next-lesson__title">PAST LESSONS</h1>
            
            {/* render a list of all the past lessons */}
            {!!pastLessons && 
                <div className="past-lessons__list">
                    {pastLessons.map(lesson=> 
                        <GridList 
                            key={lesson.id} 
                            content={{name:lesson.name, date: lesson.date, time:lesson.time, current:lesson.current}}
                            id={lesson.id} 
                            deleteBtn={false}
                            deleteType="noDelete"
                            slider={false}
                            onClick={showLesson}
                        />)}
                </div>
            }

            {/* renders a chosen lesson from the list */}
            {!!selectedLesson &&
            <div className="component next-lesson__container">
                <h2 className="component-title">{selectedLesson.name}</h2>
                    <div className = "current-lesson__top past-lessons__top">
                        <div className="next-lesson__resources">
                            <h2 className="section-title-resources next-lesson__subtitle">Resources</h2>
                            <div className="next-lesson__resources-list">
                                
                                {/* render a list of resources associated with the selected lesson */}
                                {selectedLesson.resources.length !== 0 && selectedLesson.resources.map(resource=> 
                                    <GridList 
                                        key={resource.id} 
                                        content={resource.name}
                                        resourceType={resource.type} 
                                        id={resource.id} 
                                        link={resource.url} 
                                        description={resource.type} 
                                        deleteBtn={false}
                                        deleteType="noDelete"
                                        slider={true}
                                    />)}
                            </div>
                        </div>

                        {/* renders the lesson notes for the selected lesson */}
                        <div className="">
                            <div className = "client__notes client-side__notepaper" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                <div className = "client__notes-body client-side__notes">
                                    <p className="client__notes-title client-side__notes-title" >Lesson Notes ...</p>
                                    <div className="client__notes-text"> {selectedLesson.notes}</div>
                                </div>
                            </div>
                        </div>

                        {/* renders the homework for the selected lesson */}
                        <div className="">
                                <div className = "client__notes client-side__notepaper" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                <div className = "client__notes-body client-side__notes">
                                    <p className="client__notes-title client-side__notes-title">Homework ...</p>
                                    <div className="client__notes-text"> {selectedLesson.homework}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Lessons
