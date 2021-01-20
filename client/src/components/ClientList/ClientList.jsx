import React from 'react';
import {Link} from 'react-router-dom';

import "./ClientList.scss";
import ModalContainer from '../../components/ModalContainer/ModalContainer';

function ClientList({list,match, animate, onSubmitTrainer, programs}) {

    // console.log(list);
    // console.log(match.path)
    const page = match.path.split("/")[1];
    // console.log(page);
    
    return (

    <div className={animate ? "client-list client-list--animate" : "client-list"}>
        <input className="client-list__search" type="text" placeholder="Search"/>

        {page === "clients" && <ModalContainer modalName = "addClient" buttonText="Add" onSubmitTrainer={onSubmitTrainer} information={programs}/>}
        {page === "programs" && <ModalContainer modalName = "addProgram" buttonText="Add" onSubmitTrainer={onSubmitTrainer}/>}
        {/* <button className="client-list__add" onClick={()=>addClient()}>+</button> */}

        <ul className="client-list__list">
            {page === "clients" && list.map(item => <Link key={item.userId} to={`/clients/${item.userId}/profile`}><li className="client-list__client">{`${item.userProfile.lname}, ${item.userProfile.fname}`}</li></Link>)}
            {page === "programs" && list.map(item => <Link key={item.id} to ={`/programs/${item.id}`}><li className="client-list__client">{`${item.name}`}</li></Link>)}
         </ul>
        
    </div>

    )
}

export default ClientList