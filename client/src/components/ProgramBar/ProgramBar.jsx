import React from 'react';
import {Link} from 'react-router-dom';

import "./ProgramBar.scss"

function ProgramBar({programs}) {


    return (
            <div className="program-bar">
                {/* <p className="program-bar__title">Available Programs</p> */}
                <ul className="program-bar__menu">
                    {programs.map( (program,i) => 
                        <Link to={`/programs/${program.id}`} key={i}>
                            {i===0 ? 
                                <li id={program.id} className="program-bar__menu-link program-bar__menu-link--active">{program.name}</li>
                            :
                                <li id={program.id} className="program-bar__menu-link">{program.name}</li>}
                        </Link>)}
                </ul>
                <button className="program-bar__add">+</button>
            </div>
        )
    }

export default ProgramBar
