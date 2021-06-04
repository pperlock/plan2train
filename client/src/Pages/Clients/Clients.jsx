import React, {useContext} from 'react';
import {useRouteMatch, Redirect} from 'react-router-dom';

import "./Clients.scss";

import TrainerContext from '../../store/trainer-context';

import EmptyPage from '../EmptyPage/EmptyPage';
import ClientsLayout from '../../components/ClientsLayout/ClientsLayout';

function Clients() {

    const {clients} = useContext(TrainerContext);
    const {url} = useRouteMatch();

    return (
        <>
            {!!clients &&
                <ClientsLayout> 
                    {clients.length === 0 ? <h1>No Clients</h1> : <Redirect to={`${url}/${clients[0].userId}/profile`}/>}
                </ClientsLayout>
            }
        </>
    )
}

export default Clients
