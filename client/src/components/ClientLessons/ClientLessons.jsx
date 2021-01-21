import React from 'react';
import {Link} from 'react-router-dom';

import './ClientLessons.scss'

function ClientLessons({currentClient, clientPrograms}) {
    console.log(currentClient);
    return (
        <div className="component client__programs">
            <p className="component-title">Programs</p>
            <div className="client__programs-content">
                <ul className="client__programs-list"> 
                    {clientPrograms.map(program=> <Link key={program.id} to={`/clients/${currentClient.id}`}><li onClick={()=>this.updateResources(program)} className="client__programs-list-item">{program.name}</li></Link>)}
                </ul>

                <div className="list client__programs-resources">
                    {/* {this.state.displayResources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)} */}
                </div>
            </div>

        </div>
    )
}

export default ClientLessons
