import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

import "./SideBar.scss"

import {API_URL} from '../../App.js';

function SideBar ({trainerId, programs, clients, match, client, nextLesson, pastLessons}){
    
    //default client to be displayed on the trainer page
    const defaultClientId = (clients && clients.length !==0) ? clients[0].userId : match.params.clientId;
    const splitPath = match.path.split("/");
    const profile = splitPath[1];

    //define a list of menu links objects with the necessary attributes based on the profile type 
    const sideBarList = profile ==="trainer" ?
        [{id:'1', text: 'User Profile', link:`/trainer/${trainerId}`, linkName:'trainer', icon: "/icons/user-profile-icon.svg", alt:"user profile"},
         {id:'2', text: 'Programs', linkName:'programs', icon: "/icons/programs-icon.svg", alt:"list icon",
            link: !!programs ? (programs.length === 0 ? `/trainer/${trainerId}/programs` : `/trainer/${trainerId}/programs/${programs[0].id}`):'/'},
         {id:'3', text: 'Clients', linkName:'clients', icon: "/icons/clients-icon.svg", alt:"clients icon",
            link: !!clients ? (clients.length === 0 ? `/trainer/${trainerId}/clients` : `/trainer/${trainerId}/clients/${defaultClientId}/profile`):'/'},
         {id:'4', text: 'Schedule', link: `/trainer/${trainerId}/schedule`, linkName:'schedule', icon: "/icons/calendar-icon.svg", alt:"calendar icon"},
        ]
        :
        [{id:'1', text: 'Welcome', link: `/client/${match.params.clientId}`, linkName:'client', icon: "/icons/welcome.svg", alt:"calendar icon"},
         {id:'2', text: 'Next Lesson', linkName:'nextlesson',icon: "/icons/swoopy-arrow.svg", alt:"next-lesson", 
            link: (!!client && !!nextLesson) ? `/client/${match.params.clientId}/nextlesson/${nextLesson.id}`:'/'},
         {id:'3', text: 'Past Lessons', linkName:'lessons', icon: "/icons/programs-icon.svg", alt:"user profile",
            link: (!!client && !!pastLessons) ? (pastLessons.length === 0 ? `/client/${match.params.clientId}/lessons` : `/client/${match.params.clientId}/lessons/${pastLessons[0].id}`):'/'},
        ];

    const [activeLink, setActiveLink] = useState(splitPath.length === 3 ? splitPath[1] : splitPath[3]);
    const [loggedOut, setLoggedOut] = useState(false);

    const logout = ()=>{
        axios.get(`${API_URL}/logout`)
        .then(res =>{setLoggedOut(true);})
        .catch(err =>{console.log(err)})
    }

    return (
        <>
        {loggedOut && <Redirect to="/"/>}
        <div className="sidebar" style={{backgroundImage: "url('/images/main-background.jfif')"}}>

            <div className="sidebar__logout">
                <img onClick={logout} className="sidebar__logout-icon" src="/icons/log-out.svg" alt="sign out"/>
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
                {sideBarList.map(navItem =>
                    <Link to={navItem.link} key={navItem.id}>
                        <li onClick={()=>{setActiveLink(navItem.linkName)}} 
                            className={activeLink === navItem.linkName ? "sidebar__menu-link sidebar__menu-link--active" : "sidebar__menu-link"}>
                            <img src={navItem.icon} alt={navItem.alt} 
                                className={activeLink === navItem.linkName ? "sidebar__menu-icon sidebar__menu-icon--active" : "sidebar__menu-icon"}
                            />{navItem.text}    
                        </li>
                    </Link> 
                )}
            </ul>
        </div>
        </>
    )
}

export default SideBar
