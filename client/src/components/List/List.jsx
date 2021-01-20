import React from 'react';

import './List.scss';

function List({content, description, deleteBtn}) {
    return (
        <div className="list__item">
            <p className="list__item-name">{content}</p>
            <div className="list__right">
                {description && <p className="list__right-type">{description}</p>}
                {deleteBtn && <button className="list__right-delete"> x </button>}
            </div>
        </div>
    )
}

export default List
