import React from 'react';
import {Link} from 'react-router-dom';

import "./ClientList.scss";
import ModalContainer from '../../components/ModalContainer/ModalContainer';

function ClientList({list, match, animate, onSubmit, programs}) {

    // console.log(list);
    // console.log(match.path)
    const page = match.path.split("/")[4];
    console.log(page);
    
    return (

    <div className={animate ? "client-list client-list--animate" : "client-list"}>
        <input className="client-list__search" type="text" placeholder="Search"/>
        <div className="client-list__add">
            {page === "clients" && <ModalContainer modalType="update" modalName = "addClient"  buttonType="image" url="/icons/add-user.svg" onSubmit={onSubmit} information={programs}/>}
            {page === "programs" && <ModalContainer modalType="update" modalName = "addProgram" buttonText="Add" buttonType="accent" onSubmit={onSubmit}/>}
        </div>

        <ul className="client-list__list">
            {page === "clients" && list.map(item => <Link key={item.userId} to={`/trainer/${match.params.username}/${match.params.trainerId}/clients/${item.userId}/profile`}><li className="client-list__client">{`${item.userProfile.lname}, ${item.userProfile.fname}`}</li></Link>)}
            {page === "programs" && list.map(item => <Link key={item.id} to ={`/trainer/${match.params.username}/${match.params.trainerId}/programs/${item.id}`}><li className="client-list__client">{`${item.name}`}</li></Link>)}
         </ul>
        
    </div>

    )
}

export default ClientList