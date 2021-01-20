import React from 'react';
import {Link} from 'react-router-dom';

import "./SideBar.scss"

import ProgramBar from '../../components/ProgramBar/ProgramBar';

class SideBar extends React.Component {

    

    state = {profile:"", isHovering:false};

    handleMouseHover(){
        this.setState(this.toggleHoverState);
    }

    toggleHoverState(state){
        return{
            isHovering:!state.isHovering,
        };
    }

    componentDidMount(){
        const profile = this.props.match.path.split("/")[1];
        this.setState({profile:profile});
    }


    componentDidUpdate(){
        
        const activeLink = this.props.match.path.split("/")[1];
        
        const previouslyActiveLink = document.querySelector(".sidebar__menu-link--active");
        previouslyActiveLink.classList.remove("sidebar__menu-link--active");
        
        const activeLinkElement = document.getElementById(`${activeLink}-link`);
        activeLinkElement.classList.add("sidebar__menu-link--active");

        const previouslyActiveIcon = document.querySelector(".sidebar__menu-icon--active");
        previouslyActiveIcon.classList.remove("sidebar__menu-icon--active");

        const activeIconElement = document.getElementById(`${activeLink}-icon`);
        activeIconElement.classList.add("sidebar__menu-icon--active");

    }

    render(){
        console.log(this.props.defaultProgramId);
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
                    <Link to="/trainer/username/600616b6c63ec047da27d59f">
                        <li id={`${this.state.profile}-link`} className="sidebar__menu-link sidebar__menu-link--active">
                            <img id={`${this.state.profile}-icon`} className="sidebar__menu-icon sidebar__menu-icon--active" src="/icons/user-profile-icon.svg" alt="user profile"/>
                            User Profile
                        </li>
                    </Link>
                    <Link to={`/programs/${this.props.defaultProgramId}`} onMouseLeave={()=>this.handleMouseHover()} >
                        <li id="programs-link" onMouseEnter = {()=>this.handleMouseHover()} className="sidebar__menu-link"><img id="programs-icon" className="sidebar__menu-icon"src="/icons/programs-icon.svg" alt="list icon"/>Programs</li>
                        {this.state.isHovering && <ProgramBar programs={this.props.programs}/>}
                    </Link>
                    <Link to={`/clients/${this.props.defaultClientId}/profile`}>
                        <li id="clients-link" className="sidebar__menu-link"><img  id="clients-icon" className="sidebar__menu-icon" src="/icons/clients-icon.svg" alt="clients icon"/>Clients</li>
                    </Link>
                    <Link to="/schedule">
                        <li id="schedule-link" className="sidebar__menu-link"><img id="schedule-icon" className="sidebar__menu-icon" src="/icons/calendar-icon.svg" alt="calendar icon"/>Schedule</li>
                    </Link>
                </ul>
            </div>
        )
    }
}

export default SideBar
