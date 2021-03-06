import React from 'react';
import {useRouteMatch} from 'react-router-dom';

import './EmptyPage.scss';

function EmptyPage() {
    
    const {path} = useRouteMatch();

    //determine which page the empty page is associated with based on the path
    const page=path.split("/")[3];

    //if it is the lessons page on the client side then show an empty container with instructions
    if(page==="nextlesson" || page === "lessons"){
        return(
            <div className="empty empty-client__lessons" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                <div className=" empty-container empty-client__container">
                    <div>
                        <h1 className="empty-client__header">You Don't Have Any Lessons Yet</h1>
                        <h2>Check Back Soon</h2>
                    </div>
                </div>
            </div>
        )
    }else{
        //if it is the trainer or clients page then show the sub navigation bar for the list and the appropriate instructions
        return (
            <div className="empty" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                <div className="empty__message">
                    <img className="empty__message-image chevron1" src="/icons/swoopy-arrow.svg" alt="arrow"/>

                    <div className="empty__message-text">
                        <h1>{`You Don't Have Any ${page === "programs" ? "Programs" : "Clients"} Yet`} </h1>
                        <h2>{`Click Here to Add A ${page === "programs" ? "Program" : "Client"}`}</h2>    
                    </div>
                </div>
            </div>
        )
    }
}

export default EmptyPage
