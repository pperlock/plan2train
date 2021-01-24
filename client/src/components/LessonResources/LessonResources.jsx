import React, {useState}  from 'react';
import {Link} from 'react-router-dom';
import { useDrag } from 'react-dnd'
import axios from 'axios';

// import './ClientLessons.scss'

import DNDList from '../../components/DNDList/DNDList';
import AppliedResources from '../../components/AppliedResources/AppliedResources';


const ItemTypes = {
    CARD:'card',
};

function LessonResources({programs, currentLesson, currentClient}) {


    const[displayResources, setResourceList] = useState(programs[0].resources);
    const[currentLessonResources, updateCurrentLesson] = useState(currentLesson);
    
    const updateResources=(program)=>{
       setResourceList(program.resources);
       console.log(displayResources);
    }

    // const [collectedProps, drag] = useDrag({
    //     item: ItemTypes.CARD
    // })

  const markAsDone = id => {
        // const skill = skillList.filter((skill,i)=> skill.id === id);
        // skill[0].status="in";
        // setSkillList(skillList.filter((skill,i) => skill.id !== id).concat(skill[0]));
        // console.log(skillList);

        console.log(displayResources)
        console.log(id)
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
    }

    return (
        <div className="current-lesson__resources">  
        <div className="current-lesson__available">
            {/* <p>Available Resources</p> */}
            <div className="current-lesson__available-content">
                <ul className="current-lesson__available-programs"> 
                    {programs.map(program=> <Link key={program.id} to={`/clients/${currentClient.userId}/lessons`}><li onClick={()=>updateResources(program)} className="current-lesson__available-programs-item">{program.name}</li></Link>)}
                </ul>
                    <div className="list current-lesson__available-resources">
                        {displayResources.filter(resource => resource.applied === false)
                            .map(resource=> <DNDList key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}
                    </div>                
            </div>
            
        </div>
            <AppliedResources currentLesson={currentLesson} markAsDone={markAsDone}/>
        </div>
    )
}

export default LessonResources
