import React from 'react';
import {Link} from 'react-router-dom';

import "./ClientList.scss";

function ClientList({clients}) {

    console.log(clients);
    
    
    return (

    <div className="client-list">
        <input className="client-list__search" type="text" placeholder="Search"/>

        <button className="client-list__add">+</button>

        <ul className="client-list__list">
            {clients.map(client => <Link key={client.userId} to={`/clients/${client.userId}/profile`}><li className="client-list__client">{`${client.userProfile.lname}, ${client.userProfile.fname}`}</li></Link>)}
         </ul>
        
    </div>

    )
}

export default ClientList