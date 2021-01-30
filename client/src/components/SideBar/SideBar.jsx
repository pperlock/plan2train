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
        const splitProps = this.props.match.path.split("/")
        // console.log(splitProps);
        const profile = splitProps.length === 4 ? splitProps[1] : splitProps[4]
        this.setState({profile:profile});

        
    }

    componentDidUpdate(){
        
        const splitProps = this.props.match.path.split("/")
        const activeLink = splitProps.length === 4 ? splitProps[1] : splitProps[4]

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

        if (this.state.profile){
            var {trainerId, trainerName, programs, clients, match} = this.props;
            var defaultClientId = (clients && clients.length !==0) ? clients[0].userId : match.params.clientId
        }
        console.log(this.props.client)
        console.log(this.props.nextLesson)
        console.log(!!this.props.pastLessons)

        if (this.state.profile === "trainer"){
            return (
                <>
                    <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>

                        <Link  to="/">
                                <div className="sidebar__logo">
                                    <h1 className="sidebar__logo-title" >P</h1>
                                    <span className="sidebar__logo-bigLetter">2</span> 
                                    <h1 className="sidebar__logo-title"> T</h1>
                                </div>
                        </Link>

                        <div className = "sidebar__divider"></div>
                        
                        <div className="sidebar__logout">
                            <div className="sidebar__logout-text">Log Out</div>
                            <Link to="/"><img className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/></Link>
                        </div>
                        
                        <ul className="sidebar__menu">
                            <Link to={`/trainer/${trainerName}/${trainerId}`}>
                                <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                    <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                    User Profile
                                </li>
                            </Link>
                            {programs &&
                                <Link to= {programs.length === 0 ? `/trainer/${trainerName}/${trainerId}/programs` : `/trainer/${trainerName}/${trainerId}/programs/${programs[0].id}`}>
                                    <li id="programs-link" className="sidebar__menu-link"><img id="programs-icon" className="sidebar__menu-icon"src="/icons/programs-icon.svg" alt="list icon"/>Programs</li>
                                </Link>
                            }
                            {clients &&
                                <Link to= {clients.length === 0 ? `/trainer/${trainerName}/${trainerId}/clients` : `/trainer/${trainerName}/${trainerId}/clients/${defaultClientId}/profile`}>
                                    <li id="clients-link" className="sidebar__menu-link"><img  id="clients-icon" className="sidebar__menu-icon" src="/icons/clients-icon.svg" alt="clients icon"/>Clients</li>
                                </Link>
                            }
                            <Link to="/schedule">
                                <li id="schedule-link" className="sidebar__menu-link"><img id="schedule-icon" className="sidebar__menu-icon" src="/icons/calendar-icon.svg" alt="calendar icon"/>Schedule</li>
                            </Link>
                        </ul>

                    </div>
                    
                </>
            )
        }else{
            return (
                <>
                    <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>

                        <Link  to="/">
                                <div className="sidebar__logo">
                                    <h1 className="sidebar__logo-title" >P</h1>
                                    <span className="sidebar__logo-bigLetter">2</span> 
                                    <h1 className="sidebar__logo-title"> T</h1>
                                </div>
                        </Link>

                        <div className = "sidebar__divider"></div>
                        
                        <div className="sidebar__logout">
                            <div className="sidebar__logout-text">Log Out</div>
                            <Link to="/"><img className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/></Link>
                        </div>
                        
                        <ul className="sidebar__menu">
                            <Link to={`/client/${this.props.match.params.username}/${this.props.match.params.clientId}`}>
                                <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                    <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                    Welcome
                                </li>
                            </Link>
                            {(!!this.props.client && !!this.props.nextLesson) &&
                                <Link to={`/client/${this.props.match.params.username}/${this.props.match.params.clientId}/lessons/${this.props.nextLesson.id}/nextLesson`}>
                                    <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                        <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                       Next Lesson
                                    </li>
                                </Link>
                            }

                            {(!!this.props.client && !!this.props.pastLessons) &&
                                <Link to={`/client/${this.props.match.params.username}/${this.props.match.params.clientId}/lessons/${this.props.pastLessons[0].id}`}>
                                    <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                        <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                       Past Lessons
                                    </li>
                                </Link>
                            }
                        </ul>

                    </div>
                    
                </>
            )
        // }else{
        //     return(
        //         <h1> Invalid Profile Type</h1>
        //     )
        }
    }
}

export default SideBar
