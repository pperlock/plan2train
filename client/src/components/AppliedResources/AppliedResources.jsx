import React, {useContext} from 'react'
import {useDrop} from 'react-dnd';
import axios from 'axios';

import List from '../../components/List/List';
import DNDList from '../../components/DNDList/DNDList';

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
        <div ref={drop} bg={isOver ? "green.500" : "green.200"} className= "current-lesson__resources-applied">
            <p>Lesson Resources</p>
            {currentLesson.resources.length===0 && 
                <div className="empty-container">
                    <img className="empty-container__icon" src="/icons/add-icon.svg"></img>
                    <p>Drag and Drop to Add Resources</p>
                </div>}
            {currentLesson.resources.map(resource=><DNDList key={resource.id} content={resource.name} id={resource.id}/>)}
        </div>
    )
}

export default AppliedResources
