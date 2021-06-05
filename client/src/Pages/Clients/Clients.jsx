import React, {useContext} from 'react';
import {useRouteMatch, Redirect} from 'react-router-dom';

import "./Clients.scss";

import TrainerContext from '../../store/trainer-context';

import EmptyPage from '../EmptyPage/EmptyPage';
import PageLayout from '../../components/PageLayout/PageLayout';

function Clients() {

    const {clients} = useContext(TrainerContext);
    const {url} = useRouteMatch();

    return (
        <>
            {!!clients &&
                <PageLayout> 
                    {clients.length === 0 ? <h1>No Clients</h1> : <Redirect to={`${url}/${clients[0].userId}/profile`}/>}
                </PageLayout>
            }
        </>
    )
}

export default Clients
