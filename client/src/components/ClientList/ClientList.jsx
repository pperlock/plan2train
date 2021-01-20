import React from 'react';
import {Link} from 'react-router-dom';

import "./ClientList.scss";

function ClientList({list,match}) {

    console.log(list);
    console.log(match.path)
    const page = match.path.split("/")[1];
    console.log(page);
    
    return (

    <div className="client-list">
        <input className="client-list__search" type="text" placeholder="Search"/>

        <button className="client-list__add">+</button>

        <ul className="client-list__list">
            {page === "clients" && list.map(item => <Link key={item.userId} to={`/clients/${item.userId}/profile`}><li className="client-list__client">{`${item.userProfile.lname}, ${item.userProfile.fname}`}</li></Link>)}
            {page === "programs" && list.map(item => <Link key={item.id} to ={`programs/${item.id}`}><li className="client-list__client">{`${item.name}`}</li></Link>)}
         </ul>
        
    </div>

    )
}

export default ClientList