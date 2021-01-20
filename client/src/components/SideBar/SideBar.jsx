import React from 'react';
import {Link} from 'react-router-dom';

import "./SideBar.scss"


class SideBar extends React.Component {

    //props
    // clients={this.state.clients} 
    // programs={this.state.programs} 
    // match={match}
    //trainerId
    //username = trainer username

    state = {profile:""};

    componentDidMount(){
        const profile = this.props.match.path.split("/")[1];
        this.setState({profile:profile});
    }

    componentDidUpdate(){
        
        const activeLink = this.props.match.path.split("/")[1];
        if(document.getElementById(`${activeLink}-link`)){
            const previouslyActiveLink = document.querySelector(".sidebar__menu-link--active");
            previouslyActiveLink.classList.remove("sidebar__menu-link--active");
            
            const activeLinkElement = document.getElementById(`${activeLink}-link`);
            activeLinkElement.classList.add("sidebar__menu-link--active");

            const previouslyActiveIcon = document.querySelector(".sidebar__menu-icon--active");
            previouslyActiveIcon.classList.remove("sidebar__menu-icon--active");

            const activeIconElement = document.getElementById(`${activeLink}-icon`);
            activeIconElement.classList.add("sidebar__menu-icon--active");
        }

    }

    render(){

        const {username,trainerId, trainerName, programs, clients, match} = this.props;

        const defaultClientId = clients ? clients[0].userId : match.params.clientId

        return (
                
                <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>

                <Link  to="/">
                        <div className="sidebar__logo">
                            <h1 className="sidebar__logo-title" >P</h1>
                            <span className="sidebar__logo-bigLetter">2</span> 
                            <h1 className="sidebar__logo-title"> T</h1>
                        </div>
                    </Link>
                    <div className = "sidebar__divider"></div>
                    <div className="sidebar__user">pperlock</div>
                    <ul className="sidebar__menu">
                        <Link to={`/trainer/${trainerName}/${trainerId}`}>
                            <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                User Profile
                            </li>
                        </Link>
                        {programs &&
                            <Link to={`/programs/${programs[0].id}`}>
                                <li id="programs-link" className="sidebar__menu-link"><img id="programs-icon" className="sidebar__menu-icon"src="/icons/programs-icon.svg" alt="list icon"/>Programs</li>
                            </Link>
                        }
                        {clients &&
                            <Link to={`/clients/${defaultClientId}/profile`}>
                                <li id="clients-link" className="sidebar__menu-link"><img  id="clients-icon" className="sidebar__menu-icon" src="/icons/clients-icon.svg" alt="clients icon"/>Clients</li>
                            </Link>
                        }
                        <Link to="/schedule">
                            <li id="schedule-link" className="sidebar__menu-link"><img id="schedule-icon" className="sidebar__menu-icon" src="/icons/calendar-icon.svg" alt="calendar icon"/>Schedule</li>
                        </Link>
                    </ul>
                
                </div>
            
        )
    }
}

export default SideBar
