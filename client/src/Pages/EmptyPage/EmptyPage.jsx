import React from 'react'

import './EmptyPage.scss';

import ClientList from '../../components/ClientList/ClientList';

/**
 * @param {Object} list - used to render the sub navigation sidebar
 * @param {Object} match - uses the path to conditionally render 
 * @param {Object} programs - needed to render clientlist properly
 * @param {Functon} onSubmit - function to perform action on the button included in the list
 */

function EmptyPage({list, match, onSubmit, programs}) {
    
    //determine which page the empty page is associated with based on the path
    const page=match.path.split("/")[4];

    //if it is the lessons page on the client side then show an empty container with instructions
    if(page==="lessons"){
        return(
            <div className="empty empty-lessons" style={{backgroundImage: "url('/images/main2.jfif')"}}>
          
            <div className=" empty-container empty-lessons__container">
                <div>
                    <h1 className="empty-lessons__container-header">You Don't Have Any Lessons Yet</h1>
                    <h2>Check Back Soon</h2>
                </div>
            </div>
        </div>
        )
    }else{
        //if it is the trainer or clients page then show the sub navigation bar for the list and the appropriate instructions
        return (
            <div className="empty" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                <ClientList list={list} match={match} onSubmit={onSubmit} programs={programs}/>
                
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
