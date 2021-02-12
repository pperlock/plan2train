import React, {useState, useEffect}  from 'react';
import {useDrop} from 'react-dnd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ScrollMenu from 'react-horizontal-scrolling-menu';

import './LessonResources.scss'

import DNDList from '../../components/DNDList/DNDList';
import AppliedResources from '../../components/AppliedResources/AppliedResources';

/**
 * 
 * @param {Object} programs - all the trainer's programs
 * @param {Object} currentLesson - lesson currently rendered
 * @param {Object} currentClient - client currently rendered
 */

function LessonResources({programs, currentLesson, currentClient, match}) {

    // console.log(programs);
    const ItemTypes = {
        CARD:'card',
    };

    const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

    const [allResources, setAllResources] = useState(programs);
    
    //resources that are currently being displayed - change based on program chosen
    const[displayResources, setResourceList] = useState(programs.length!==0 ? programs[0].resources : []);

    //current lesson being rendered - changed based on drag and drop from available resources 
    const[currentLessonResources, updateCurrentLesson] = useState(currentLesson);

       
     //update the resources of the current lesson when state changes
    useEffect(() => {
        updateCurrentLesson(currentLesson);
        // console.log(displayResources)
    },[currentLesson]);

    

    // update the resources being displayed when a program is chosen
    const updateDisplayed = (program)=>{

        if (document.querySelector(".active-program")){
            const previouslyActiveLink = document.querySelector(".active-program");
            previouslyActiveLink.classList.remove("active-program");
            console.log(previouslyActiveLink);
            
            const activeLinkElement = document.getElementById(program.id);
            activeLinkElement.classList.add("active-program");
            console.log(activeLinkElement);
        }
        setResourceList(program.resources);
    }

    //used to remove a resource from the available resources and add it to the lesson resources
    const markAsDone = id => {

        const sameBox = currentLessonResources.resources.find(resource=> resource.id===id);
        // const sameDisplayBox = displayResources.find(resource=> resource.id===id);

        if (!sameBox){
            //find the resource to update and set the applied status to true        
            const displays = [...displayResources];
            displays.find(resource=> resource.id === id).applied=true;
                
            const lessonObject = {...currentLessonResources};
            
            // take the id from the resource that was moved, find the data associated with it and push it to the resources of the current lesson

            console.log(displays.find(resource=> resource.id === id))

            lessonObject.resources.push(displays.find(resource=> resource.id === id));

            //update the displaye resources and the lesson resources that are rendered
            setResourceList(displays);
            updateCurrentLesson(lessonObject);

            //create an array of the ids associated with the updated resources to push to the db
            const updatedResources = lessonObject.resources.map(resource => resource)
            console.log(updatedResources);

            //update the db with the new lesson resources
            axios.put(`${API_URL}/client/${currentClient.userId}/${currentLessonResources.id}/updateResource`, updatedResources)
            .then(res =>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
        }

    }

    const removeResource=(id)=>{
        
        const alreadyDisplayed = displayResources.find(resource=> resource.id===id);
        const sameBox = !!alreadyDisplayed && alreadyDisplayed.applied===false;

        console.log(alreadyDisplayed);

        if(!sameBox){
            //find the resource to update and set the applied status to true        
            const available = [...allResources];
            available.forEach(program=>{
                const foundResource = program.resources.find(resource=> resource.id === id)
                if(foundResource){ 
                    foundResource.applied=false;
                }
            });

            const lessonObject = {...currentLessonResources};
            // take the id from the resource that was moved, find the data associated with it and push it to the resources of the current lesson
            const index = lessonObject.resources.findIndex(resource => resource.id === id);
            lessonObject.resources.splice(index,1);

            //update the display resources and the lesson resources that are rendered
            setAllResources(available);
            updateCurrentLesson(lessonObject);

            //create an array of the ids associated with the updated resources to push to the db
            const updatedResources = lessonObject.resources.map(resource => resource)
            console.log(updatedResources);

            // update the db with the new lesson resources
            axios.put(`${API_URL}/client/${currentClient.userId}/${currentLessonResources.id}/updateResource`, updatedResources)
            .then(res =>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }

    //setup for drop component from lessons ---> available
    const[{isOver}, drop] = useDrop({
        accept: ItemTypes.CARD, //required - tells drop zone it will only accept card components
        drop: (item, monitor)=> removeResource(item.id),
        // collect: monitor => ({
        //     isOver: !!monitor.isOver(),
        // }),
    });

//program list scrolling
    function sideScroll(element,direction,speed,distance,step){
        let scrollAmount = 0;
        var slideTimer = setInterval(function(){
            if(direction == 'left'){
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if(scrollAmount >= distance){
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    const scrollContainer = document.querySelector('.current-lesson__available-programs');

    if (!!scrollContainer){
        scrollContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY > 0) sideScroll(scrollContainer,'left',25,100,10);
            else sideScroll(scrollContainer,'right',25,100,10);
        });
    }

    const scrollList = (direction)=>{
        const scrollContainer = document.querySelector('.current-lesson__available-programs');
        direction ==="right" ? sideScroll(scrollContainer,'right',25,100,10): sideScroll(scrollContainer,'left',25,100,10);
    }

    if(programs.length===0){
        return(                                     
            // <div onClick={this.addNewLesson} className="empty-container">
            <div className="empty-container empty-lesson__resources">
                <h2>You Don't have any Programs Yet!</h2>
                <Link to={`/trainer/${match.params.trainerId}/programs`} className="empty-lesson__resources-link">Click Here to Add Some Programs and Resources</Link>
            </div>
        )
    
    }else{

        return (
            <div className="current-lesson__resources">  
                <div className="current-lesson__available">
                    {/* <p>Available Resources</p> */}
                    <div className="current-lesson__available-content">
                        <div className="scroll-container">
                            <img src="/icons/chevron-left.svg" className="chevron-left" onClick={()=>{scrollList("left")}}/>
                            <ul className="current-lesson__available-programs"> 
                                {programs.map((program,i) => 
                                    <Link key={program.id} to={`/trainer/${match.params.trainerId}/clients/${currentClient.userId}/lessons`}>
                                        <li id={program.id} onClick={()=>updateDisplayed(program)} 
                                            className={i===0 ? "current-lesson__available-programs-item active-program" : "current-lesson__available-programs-item"}>{program.name}
                                        </li>
                                    </Link>)}
                            </ul>
                            <img src="/icons/chevron-left.svg" className="chevron-right" onClick={()=>{scrollList("right")}}/>
                        </div>
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
}

export default LessonResources
