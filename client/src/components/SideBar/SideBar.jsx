import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import "./SideBar.scss"

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

class SideBar extends React.Component {

    //props
    // clients={this.state.clients} 
    // programs={this.state.programs} 
    // match={match}
    //trainerId
    //username = trainer username
    //history - history props from router

    state = {profile:""};

    componentDidMount(){
        const splitProps = this.props.match.path.split("/")
        // console.log(splitProps);
        const profile = splitProps.length === 4 ? splitProps[1] : splitProps[4]
        this.setState({profile:profile});

        
    }

    componentDidUpdate(){
        
        const splitProps = this.props.match.path.split("/")
        const activeLink = splitProps.length === 3 ? splitProps[1] : splitProps[3]

        if(document.getElementById(`${activeLink}-link`)){
            const previouslyActiveLink = document.querySelector(".sidebar__menu-link--active");
            previouslyActiveLink.classList.remove("sidebar__menu-link--active");
            
            const activeLinkElement = document.getElementById(`${activeLink}-link`);
            activeLinkElement.classList.add("sidebar__menu-link--active");
        }

    }

    logout = ()=>{
        axios.get(`${API_URL}/logout`)
        .then(res =>{
            this.props.history.push("/");
            console.log(res);
        })
        .catch(err =>{
            console.log(err);
        })
    }

    render(){
        const profile = this.props.match.path.split("/")[1]

        if (profile){
            var {trainerId, trainerName, programs, clients, match} = this.props;
            var defaultClientId = (clients && clients.length !==0) ? clients[0].userId : match.params.clientId
        }

        if (profile === "trainer"){
            return (
                <>
                    <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>

                        <div className="sidebar__logout">
                            <img onClick={this.logout} className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/>
                            {/* <Link to="/"><img className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/></Link> */}
                        </div>

                        <Link to="/">
                            <div className="sidebar__logo">
                                <h1 className="sidebar__logo-title" >P</h1>
                                <span className="sidebar__logo-bigLetter">2</span> 
                                <h1 className="sidebar__logo-title"> T</h1>
                            </div>
                        </Link>

                        <div className = "sidebar__divider"></div>
                
                        <ul className="sidebar__menu">
                            <Link to={`/trainer/${trainerId}`}>
                                <li id="trainer-link" className="sidebar__menu-link sidebar__menu-link--active">
                                    <img id="trainer-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                                    User Profile
                                </li>
                            </Link>
                            {programs &&
                                <Link to= {programs.length === 0 ? `/trainer/${trainerId}/programs` : `/trainer/${trainerId}/programs/${programs[0].id}`}>
                                    <li id="programs-link" className="sidebar__menu-link"><img id="programs-icon" className="sidebar__menu-icon sidebar__menu-icon--active"src="/icons/programs-icon.svg" alt="list icon"/>Programs</li>
                                </Link>
                            }
                            {clients &&
                                <Link to= {clients.length === 0 ? `/trainer/${trainerId}/clients` : `/trainer/${trainerId}/clients/${defaultClientId}/profile`}>
                                    <li id="clients-link" className="sidebar__menu-link"><img  id="clients-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/clients-icon.svg" alt="clients icon"/>Clients</li>
                                </Link>
                            }
                            <Link to={`/trainer/${trainerId}/schedule`}>
                                <li id="schedule-link" className="sidebar__menu-link"><img id="schedule-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/calendar-icon.svg" alt="calendar icon"/>Schedule</li>
                            </Link>
                        </ul>

                    </div>
                    
                </>
            )
        }else{
            return (
                <>
                    <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>
                        <div className="sidebar__logout">
                            {/* <div className="sidebar__logout-text">Log Out</div> */}
                            <Link to="/"><img className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/></Link>
                        </div>

                        <Link  to="/">
                                <div className="sidebar__logo">
                                    <h1 className="sidebar__logo-title" >P</h1>
                                    <span className="sidebar__logo-bigLetter">2</span> 
                                    <h1 className="sidebar__logo-title"> T</h1>
                                </div>
                        </Link>

                        <div className = "sidebar__divider"></div>
                        
                        <ul className="sidebar__menu">
                            <Link to={`/client/${this.props.match.params.clientId}`}>
                                <li id="client-link" className="sidebar__menu-link sidebar__menu-link--active">
                                    <img id="client-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/welcome.svg" alt="user profile"/>
                                    Welcome
                                </li>
                            </Link>

                            {(!!this.props.client && !!this.props.nextLesson) &&
                                <Link to={`/client/${this.props.match.params.clientId}/nextlesson/${this.props.nextLesson.id}`}>
                                    <li id="nextlesson-link" className="sidebar__menu-link">
                                        <img id="nextlesson-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/swoopy-arrow.svg" alt="next-lesson"/>
                                       Next Lesson
                                    </li>
                                </Link>
                            }

                            {(!!this.props.client && !!this.props.pastLessons) &&
                                <Link to={this.props.pastLessons.length === 0 ? `/client/${this.props.match.params.clientId}/lessons` : `/client/${this.props.match.params.clientId}/lessons/${this.props.pastLessons[0].id}`}>
                                    <li id="lessons-link" className="sidebar__menu-link">
                                        <img id="lessons-icon" className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/programs-icon.svg" alt="user profile"/>
                                       Past Lessons
                                    </li>
                                </Link>
                            }
                        </ul>

                    </div>
                    
                </>
            )
        }
    }
}

export default SideBar
