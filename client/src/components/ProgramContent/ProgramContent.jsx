import React from 'react';
import "./ProgramContent.scss";

import List from '../../components/List/List';

function ProgramContent({program}) {
     return (
        <div className="program">
            <div className="component program__resources">
                <div className="program__header">
                    <p className="program__header-title">{program.name}</p>
                    <p className="program__header-description">{program.description}</p>
                </div>

                <div className="list">
                        {program.resources.map(resource=> <List content={resource.name} id={resource.id} description={resource.type} deleteBtn={true} />)}
                </div>
                <button className="add resource__add"> + </button>
            </div>
        </div>
    )
}

export default ProgramContent
