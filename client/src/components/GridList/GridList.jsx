import React from 'react';

import './GridList.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';


function GridList({id, content, modalName, link, deleteBtn, deleteFunction, deleteString, list, deleteType, resourceType, onClick, updateStatus}) {

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
                {resourceType ?
                    <a className="gridlist__item-link" href={link} target="_blank">
                        <p className="gridlist__item-name">{content}</p>
                    </a>
                    :
                    <div>
                        <p onClick={()=>onClick(id)} className="gridlist__item-multi gridlist__item-title">{content.name ==="" ? "Add Title" : content.name}</p>
                        <p className="gridlist__item-multi">{content.date}</p>
                        <p className="gridlist__item-multi">{content.time}</p>
                    </div>
                }

                
                <div className="gridlist__bottom">
                    {(deleteType !== "modal" && deleteBtn) && <button id={id} onClick={(event)=>deleteFunction(event, list)} className="gridlist__right-delete"> x </button>}

                    {resourceType ? 
                        <img className="gridlist__item-image" src={resourceURL} alt="icon"/>
                        :
                        <div className="current-lesson__top-status">
                            <input onClick={updateStatus} className="current-lesson__top-status-check" type="checkbox" id="current"/>
                            <div className={content.current ? "slidinggroove slidinggroove-on" : "slidinggroove"}></div>
                            <label className="current-lesson__top-status" htmlFor="current" name="current"><p className="current-lesson__top-status-label"> {content.current && "Current"}</p></label>
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
                        />
                    }
                 </div>
            </div>
    )
}

export default GridList