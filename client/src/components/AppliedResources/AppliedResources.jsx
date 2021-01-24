import React, {useContext} from 'react'
import {useDrop} from 'react-dnd';
import {Link} from 'react-router-dom';
import axios from 'axios';

import List from '../../components/List/List';

const ItemTypes = {
    CARD:'card',
};

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
            {currentLesson.resources.map(resource=><List key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}

        </div>
    )
}

export default AppliedResources
