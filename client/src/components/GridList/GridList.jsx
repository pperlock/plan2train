import React from 'react';

import './GridList.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';


function GridList({id, content, link, deleteBtn, deleteFunction, list, deleteType, resourceType}) {

    console.log(resourceType)
    let resourceURL=""
    if (resourceType === "pdf"){
        resourceURL = "/icons/pdf.png"
    }else if (resourceType === "video"){
        resourceURL = "/icons/video.png"
    }else if (resourceType === "doc"){
        resourceURL = "/icons/doc-icon.png"
    }else if (resourceType === "url"){
        resourceURL = "/icons/website-icon.png"
    }else if (resourceType === "image"){
        resourceURL = "/icons/image.svg"
    }

    return (
            <div className="gridlist__item">
                <a className="gridlist__item-link" href={link} target="_blank">
                    <p className="gridlist__item-name">{content}</p>
                </a>
                <div className="gridlist__bottom">
                    {(deleteType !== "modal" && deleteBtn) && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="gridlist__right-delete"> x </button>}

                    <img className="gridlist__item-image" src={resourceURL} alt="icon"/>
                    {deleteType==="modal" &&
                        <ModalContainer 
                            modalType = "delete" 
                            modalName = "delete"
                            buttonType="x" 
                            buttonText="x" 
                            onSubmitTrainer={deleteFunction}
                            deleteString= {content}
                            deleteId={id}
                        />
                    }
                </div>
            </div>
    )
}

export default GridList
