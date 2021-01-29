import React from 'react'

import './EmptyPage.scss';
import ClientList from '../../components/ClientList/ClientList';

function EmptyPage({list, match, onSubmit, programs}) {
    
    const page=match.path.split("/")[4];

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

export default EmptyPage
