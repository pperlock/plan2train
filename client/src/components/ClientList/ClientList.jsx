import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import "./ClientList.scss";
import ModalContainer from '../../components/ModalContainer/ModalContainer';

function ClientList({list, match, animate, onSubmit, programs}) {

    const [filter, setFilter] = useState("");
    
    const searchList = (event) => {
        setFilter(event.target.value);
    }
   
    const page = match.path.split("/")[3];

    let filteredList = list;
    
    const lowercasedFilter = filter.toLowerCase();
    if (page==="clients") {
        filteredList = list.filter(item => {
            return item.userProfile['fname'].toLowerCase().includes(lowercasedFilter) || item.userProfile['lname'].toLowerCase().includes(lowercasedFilter)
        });
    }else{
        filteredList = list.filter(item => {
            return item['name'].toLowerCase().includes(lowercasedFilter)
        });
    }

    return (

        <div className={animate ? "client-list client-list--animate" : "client-list"}>
            <input className="client-list__search" type="search" placeholder="Search by Name" onChange={searchList}/>
            <div className={page==="clients" ? "client-list__add" : "client-list__add client-list__add-programs"}>
                {page === "clients" && <ModalContainer modalType="update" modalName = "addClient"  buttonType="image" url="/icons/add-user.svg" onSubmit={onSubmit} information={programs}/>}
                {page === "programs" && <ModalContainer modalType="update" modalName = "addProgram" buttonType="image" url="/icons/plus-square.svg" onSubmit={onSubmit}/>}
            </div>

            {list &&
            <ul className="client-list__list">
                {page === "clients" && filteredList.map(item => <Link key={item.userId} to={`/trainer/${match.params.trainerId}/clients/${item.userId}/profile`}><li className="client-list__client">{`${item.userProfile.lname}, ${item.userProfile.fname}`}</li></Link>)}
                {page === "programs" && filteredList.map(item => <Link key={item.id} to ={`/trainer/${match.params.trainerId}/programs/${item.id}`}><li className="client-list__client">{`${item.name}`}</li></Link>)}
            </ul>}
        </div>

    )
}

export default ClientList