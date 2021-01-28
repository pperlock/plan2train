import React from 'react';

import './List.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';


function List({id, content, link, description, deleteBtn, deleteFunction, list, deleteType}) {
    return (
        <div className="list__item">
            <a href={link} className="list__item-name" target="_blank">{content}</a>
            <div className="list__right" >
                {description && <p className="list__right-type">{description}</p>}
                
                {/* conditionally renders a delete button depending on the deleteType variable - won't show for current lesson - don't want to allow deletion */}
                {(deleteType !== "modal" && deleteBtn) && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="list__right-delete"> x </button>}
                
                {deleteType==="modal" &&
                    <ModalContainer 
                        modalType = "delete" 
                        modalName = "delete" 
                        buttonText="x" 
                        onSubmit={deleteFunction}
                        deleteString= {content}
                        deleteId={id}
                        buttonType="x"
                    />
                }
            </div>
        </div>
    )
}

export default List
