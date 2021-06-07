import React, {useState} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import axios from 'axios';

import "./SideBar.scss"

import {API_URL} from '../../App.js';

function SideBar ({client, nextLesson,location}){
    
    const profile = location.pathname.split("/")[1];
    const id = location.pathname.split("/")[2];

    //define a list of menu links objects with the necessary attributes based on the profile type 
    const sideBarList = profile ==="trainer" ?
        [{id:'1', text: 'User Profile', link:`/trainer/${id}`, linkName:'trainer', icon: "/icons/user-profile-icon.svg", alt:"user profile"},
         {id:'2', text: 'Programs', linkName:'programs', icon: "/icons/programs-icon.svg", alt:"list icon", link: `/trainer/${id}/programs`},
         {id:'3', text: 'Clients', linkName:'clients', icon: "/icons/clients-icon.svg", alt:"clients icon", link: `/trainer/${id}/clients`},
         {id:'4', text: 'Schedule', link: `/trainer/${id}/schedule`, linkName:'schedule', icon: "/icons/calendar-icon.svg", alt:"calendar icon"},
        ]
        :
        [
         {id:'1', text: 'Welcome', link: `/client/${id}`, linkName:'client', icon: "/icons/welcome.svg", alt:"calendar icon"},
         {id:'2', text: 'Next Lesson', linkName:'nextlesson',icon: "/icons/swoopy-arrow.svg", alt:"next-lesson", link: `/client/${id}/nextlesson`},
         {id:'3', text: 'Past Lessons', linkName:'lessons', icon: "/icons/programs-icon.svg", alt:"user profile", link: `/client/${id}/lessons`},
        ];

    const [activeLink, setActiveLink] = useState(sideBarList[0].linkName);
    const [loggedOut, setLoggedOut] = useState(false);

    const logout = async ()=>{
        try{
            await axios.get(`${API_URL}/logout`);
            setLoggedOut(true);
        }catch(err){
            console.log(err)
        }
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

export default withRouter(SideBar)
