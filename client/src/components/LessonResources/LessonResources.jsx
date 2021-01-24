import React, {useState, useEffect}  from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

// import './ClientLessons.scss'

import DNDList from '../../components/DNDList/DNDList';
import AppliedResources from '../../components/AppliedResources/AppliedResources';

function LessonResources({programs, currentLesson, currentClient}) {

    console.log(currentLesson);

    const[displayResources, setResourceList] = useState(programs[0].resources);
    const[currentLessonResources, updateCurrentLesson] = useState(currentLesson);
    
    
    useEffect(() => {
        updateCurrentLesson(currentLesson);
    });

    const updateDisplayed = (program)=>{
        setResourceList(program.resources);
    }
    console.log(currentLessonResources);

    const markAsDone = id => {

        //find the resource to update and set the applied status to true        
        const displays = [...displayResources]
        displays.find(resource=> resource.id === id).applied=true
        // displays.map((resource) => {resource.applied = resource.id === id && true});
        
        const lessonObject = {...currentLessonResources}
        console.log(lessonObject)
        lessonObject.resources.push(displays.find(resource=> resource.id === id))

        console.log(displays)
        console.log(lessonObject);
        setResourceList(displays);
        updateCurrentLesson(lessonObject);

        const updatedResources = lessonObject.resources.map(resource => resource.id)
        console.log(updatedResources);

        axios.put(`http://localhost:8080/client/${currentClient.userId}/${currentLessonResources.id}/updateResource`, updatedResources)
        .then(res =>{
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })

    }

    return (
        <div className="current-lesson__resources">  
        <div className="current-lesson__available">
            {/* <p>Available Resources</p> */}
            <div className="current-lesson__available-content">
                <ul className="current-lesson__available-programs"> 
                    {programs.map(program=> <Link key={program.id} to={`/clients/${currentClient.userId}/lessons`}><li onClick={()=>updateDisplayed(program)} className="current-lesson__available-programs-item">{program.name}</li></Link>)}
                </ul>
                    <div className="list current-lesson__available-resources">
                        {displayResources.filter(resource => resource.applied === false)
                            .map(resource=> <DNDList key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}
                    </div>                
            </div>
            
        </div>
            <AppliedResources currentLesson={currentLessonResources} markAsDone={markAsDone}/>
        </div>
    )
}

export default LessonResources
