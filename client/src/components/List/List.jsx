import React from 'react';

import './List.scss';


function List({id, content, link, description, deleteBtn, deleteFunction, list}) {

    return (
        <div className="list__item">
            <a href={link} className="list__item-name" target="_blank">{content}</a>
            <div className="list__right" >
                {description && <p className="list__right-type">{description}</p>}
                {deleteBtn && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="list__right-delete"> x </button>}
                {/* {deleteBtn && <button onClick={()=>log("Patti")} className="list__right-delete"> x </button>} */}
            </div>
        </div>
    )
}

export default List
