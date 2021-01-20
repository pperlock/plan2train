import React from 'react';
import "./Programs.scss"

import ClientList from '../../components/ClientList/ClientList';
import ProgramContent from '../../components/ProgramContent/ProgramContent';

function Programs({programs, currentProgramId, match}) {

    return (
        <div className="programs__container">
            <ClientList list={programs} match={match}/>
            <ProgramContent program={programs.filter(program=>program.id===currentProgramId)[0]}/>
        </div>
    )
};

export default Programs
