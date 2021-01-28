import React, {useState, useEffect}  from 'react';
import {useDrop} from 'react-dnd';
import {Link} from 'react-router-dom';
import axios from 'axios';

// import './ClientLessons.scss'

import DNDList from '../../components/DNDList/DNDList';
import AppliedResources from '../../components/AppliedResources/AppliedResources';

/**
 * 
 * @param {Object} programs - all the trainer's programs
 * @param {Object} currentLesson - lesson currently rendered
 * @param {Object} currentClient - client currently rendered
 */

function LessonResources({programs, currentLesson, currentClient, match}) {

    const ItemTypes = {
        CARD:'card',
    };

    //resources that are currently being displayed - change based on program chosen
    const[displayResources, setResourceList] = useState(programs[0].resources);

    //current lesson being rendered - changed based on drag and drop from available resources 
    const[currentLessonResources, updateCurrentLesson] = useState(currentLesson);
    
    
    //update the resources of the current lesson when state changes
    useEffect(() => {
        updateCurrentLesson(currentLesson);
    },[currentLesson]);

    // update the resources being displayed when a program is chosen
    const updateDisplayed = (program)=>{
        setResourceList(program.resources);
    }

    //used to remove a resource from the available resources and add it to the lesson resources
    const markAsDone = id => {

        //find the resource to update and set the applied status to true        
        const displays = [...displayResources];
        displays.find(resource=> resource.id === id).applied=true;
             
        const lessonObject = {...currentLessonResources};
        // take the id from the resource that was moved, find the data associated with it and push it to the resources of the current lesson
        lessonObject.resources.push(displays.find(resource=> resource.id === id));

        //update the displaye resources and the lesson resources that are rendered
        setResourceList(displays);
        updateCurrentLesson(lessonObject);

        //create an array of the ids associated with the updated resources to push to the db
        const updatedResources = lessonObject.resources.map(resource => resource.id)
        console.log(updatedResources);

        //update the db with the new lesson resources
        axios.put(`http://localhost:8080/client/${currentClient.userId}/${currentLessonResources.id}/updateResource`, updatedResources)
        .then(res =>{
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })

    }

    const removeResource=(id)=>{
        console.log(id);
         //find the resource to update and set the applied status to true        
        const displays = [...displayResources];
        displays.find(resource=> resource.id === id).applied=false;
             
        const lessonObject = {...currentLessonResources};
        // take the id from the resource that was moved, find the data associated with it and push it to the resources of the current lesson
        const index = lessonObject.resources.findIndex(resource => resource.id === id);
        lessonObject.resources.splice(index,1);

        //update the display resources and the lesson resources that are rendered
        setResourceList(displays);
        updateCurrentLesson(lessonObject);

        //create an array of the ids associated with the updated resources to push to the db
        const updatedResources = lessonObject.resources.map(resource => resource.id)
        console.log(updatedResources);

        // update the db with the new lesson resources
        axios.put(`http://localhost:8080/client/${currentClient.userId}/${currentLessonResources.id}/updateResource`, updatedResources)
        .then(res =>{
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    //setup for drop componenet from  lessons - available
    const[{isOver}, drop] = useDrop({
        accept: ItemTypes.CARD, //required - tells drop zone it will only accept card components
        drop: (item, monitor)=> removeResource(item.id),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div className="current-lesson__resources">  
            <div className="current-lesson__available">
                {/* <p>Available Resources</p> */}
                <div className="current-lesson__available-content">
                    <ul className="current-lesson__available-programs"> 
                        {programs.map(program=> <Link key={program.id} to={`/trainer/${match.params.username}/${match.params.trainerId}/clients/${currentClient.userId}/lessons`}><li onClick={()=>updateDisplayed(program)} className="current-lesson__available-programs-item">{program.name}</li></Link>)}
                    </ul>
                        <div ref={drop} className="list current-lesson__available-resources">
                            {displayResources.filter(resource => resource.applied === false)
                                .map(resource=> <DNDList key={resource.id} content={resource.name} link={resource.link} id={resource.id}/>)}
                        </div>                
                </div>
            </div>
            {/* applied resources component set up as a drop component */}
            <AppliedResources currentLesson={currentLessonResources} markAsDone={markAsDone}/>
        </div>
    )
}

export default LessonResources
