import React from 'react';
import { useDrag } from 'react-dnd';

import './DNDList.scss';

const ItemTypes = {
    CARD:'card',
};

/**
 * 
 * @param {string} id - resource id 
 * @param {string} content - text to render
 * @param {string} link - url for text to link to
 * @param {string} description- type of resource if it is a resource list
 * 
 */
function DNDList({id, content, link, description}) {

    // argument1 = props from the monitor
    const[{isDragging}, drag] = useDrag({
        item:{
            type:ItemTypes.CARD,
            //type is required - can pass anything else you want with it - here i want the id
            id: id,
        },
        //talks to the monitor and sets the isDragging prop to true when is dragging
        collect:monitor=>({
            isDragging:!!monitor.isDragging(),
        }),
    })

    return (
        <div ref={drag} className="list__item" opacity={isDragging ? '1' : '1'}>
            <a href={link} className="list__item-name" target="_blank">{content}</a>
            <div className="list__right" >
                {description && <p className="list__right-type">{description}</p>}
            </div>
        </div>
    )
}

export default DNDList
