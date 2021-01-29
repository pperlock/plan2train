import React from 'react'
import {useDrop} from 'react-dnd';

import DNDList from '../../components/DNDList/DNDList';
import './AppliedResources.scss'

const ItemTypes = {
    CARD:'card',
};

/**
 * 
 * @param {object} currentLesson - lesson rendered on screen
 * @param {function} markAsDone - function to update state on Lesson Resources when item is dragged here
 */


function AppliedResources({currentLesson, markAsDone}) {
    
    const[{isOver}, drop] = useDrop({
        
        accept: ItemTypes.CARD, //required - tells drop zone it will only accept card components
        drop: (item, monitor)=> markAsDone(item.id),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div className="current-lesson__resources-applied-container">
            <p className="current-lesson__resources-title">Lesson Resources</p>
            <div ref={drop} className= {isOver ? "current-lesson__resources-applied drop-target-active" : "current-lesson__resources-applied"}>
                {currentLesson.resources.length===0 && 
                    <div className="empty-container">
                        <img className="empty-container__icon" src="/icons/add-icon.svg" alt="plus sign"></img>
                        <p>Drag and Drop to Add Resources</p>
                    </div>}
                {currentLesson.resources.map(resource=><DNDList key={resource.id} content={resource.name} id={resource.id}/>)}
            </div>
        </div>
    )
}

export default AppliedResources
