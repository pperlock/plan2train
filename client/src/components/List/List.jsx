import React from 'react';

import './List.scss';

function List({content, link, description, deleteBtn}) {
    return (
        <div className="list__item">
            <a href={link} className="list__item-name" target="_blank">{content}</a>
            <div className="list__right">
                {description && <p className="list__right-type">{description}</p>}
                {deleteBtn && <button className="list__right-delete"> x </button>}
            </div>
        </div>
    )
}

export default List
