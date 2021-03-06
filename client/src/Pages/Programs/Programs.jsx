import React, {useContext} from 'react';
import {useRouteMatch, Redirect} from 'react-router-dom';

import "./Programs.scss";

import PageLayout from '../../components/PageLayout/PageLayout';
import EmptyPage from '../EmptyPage/EmptyPage';

import TrainerContext from '../../store/trainer-context';

const Programs  = () => {

    const {programs} = useContext(TrainerContext);
    const {url} = useRouteMatch();
    
    return (
        <>
            {!!programs &&
                <PageLayout> 
                    {programs.length === 0 ? <EmptyPage/> : <Redirect to={`${url}/${programs[0].id}`}/>}
                </PageLayout>
            }
        </>
    )

};

export default Programs
