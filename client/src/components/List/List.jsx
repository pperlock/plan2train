import React from 'react';

import './List.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';


function List({id, content, link, description, deleteBtn, deleteFunction, list, deleteType}) {
    return (
        <div className="list__item">
            <a href={link} className="list__item-name" target="_blank">{content}</a>
            <div className="list__right" >
                {description && <p className="list__right-type">{description}</p>}
                {(deleteType !== "modal" && deleteBtn) && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="list__right-delete"> x </button>}
                
                {deleteType==="modal" &&
                    <ModalContainer 
                        modalType = "delete" 
                        modalName = "delete" 
                        buttonText="x" 
                        onSubmitTrainer={deleteFunction}
                        deleteString= {content}
                        deleteId={id}
                    />
                }
                {/* {deleteBtn && <button onClick={()=>log("Patti")} className="list__right-delete"> x </button>} */}
            </div>
        </div>
    )
}

export default List
