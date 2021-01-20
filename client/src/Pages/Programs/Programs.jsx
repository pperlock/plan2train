import React from 'react';
import "./Programs.scss"

import ClientList from '../../components/ClientList/ClientList';
import ProgramContent from '../../components/ProgramContent/ProgramContent';

function Programs({programs, currentProgramId, match}) {

    console.log(programs);
    console.log(match.params.programId)

    return (
        <div className="programs__container">
            <ClientList list={programs} match={match}/>
            <ProgramContent program={programs.find(program=>program.id===match.params.programId)}/>
        </div>
    )
};

export default Programs
