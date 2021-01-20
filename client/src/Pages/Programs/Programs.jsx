import React from 'react';
import "./Programs.scss"

import ClientList from '../../components/ClientList/ClientList';
import ProgramContent from '../../components/ProgramContent/ProgramContent';

function Programs({programs,match, addProgram}) {

    return (
        <div className="programs__container">
            <ClientList list={programs} match={match} onSubmitTrainer={addProgram}/>
            <ProgramContent program={programs.find(program=>program.id===match.params.programId)}/>
        </div>
    )
};

export default Programs
