import React from 'react';
import "./Programs.scss"

// import ProgramBar from '../../components/ProgramBar/ProgramBar';
import ProgramContent from '../../components/ProgramContent/ProgramContent';

function Programs({programs, currentProgramId}) {
    return (
        <div className="programs__container">
            {/* <ProgramBar programs={programs}/> */}
            <ProgramContent program={programs.filter(program=>program.id===currentProgramId)[0]}/>
        </div>
    )
};

export default Programs
