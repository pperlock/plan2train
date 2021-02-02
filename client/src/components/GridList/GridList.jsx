import React from 'react';

import './GridList.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';


function GridList({id, content, modalName, link, deleteBtn, deleteFunction, deleteString, list, deleteType, resourceType, onClick, updateStatus, slider}) {

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
            <div className={(deleteBtn || !slider) ? "gridlist__item" : "gridlist__item next-lesson__resource"}>
                {resourceType ?
                    <a className="gridlist__item-link" href={link} target="_blank" rel="noopener noreferrer">
                        <p className="gridlist__item-name">{content}</p>
                    </a>
                    :
                    <div onClick={()=>onClick(id)} className="gridlist__item-multi-container">
                        <p className="gridlist__item-multi gridlist__item-title">{content.name ==="" ? "Add Title" : content.name}</p>
                        <p className="gridlist__item-multi">{content.date}</p>
                        <p className="gridlist__item-multi">{content.time}</p>
                    </div>
                }

                <div className="gridlist__bottom">
                    {(deleteType !== "modal" && deleteBtn) && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="gridlist__right-delete"> x </button>}

                    {(resourceType || !slider) ? 
                        resourceType && <img className="gridlist__item-image" src={resourceURL} alt="icon"/>
                        :
                        <div className="current-lesson__top-status">
                            <input onClick={(event)=>updateStatus(event)} className="current-lesson__top-status-check" type="checkbox" id={id}/>
                            <div className={content.current ? "slidinggroove-on" : "slidinggroove"}></div>
                            <label className="current-lesson__top-status" htmlFor={id} name="current"><p className="current-lesson__top-status-label"> {content.current && "NEXT"}</p></label>
                        </div>
                    }
                    {deleteType==="modal" &&
                        <ModalContainer 
                            modalType = "delete" 
                            modalName = {modalName}
                            buttonType="x" 
                            buttonText="x" 
                            onSubmit={deleteFunction}
                            deleteString= {deleteString}
                            deleteId={id}
                            slider={slider}
                        />
                    }
                 </div>
            </div>
    )
}

export default GridList