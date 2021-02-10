import React from 'react';
import axios from 'axios';

import './ClientLessons.scss'

import GridList from '../../components/GridList/GridList';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import LessonResources from '../../components/LessonResources/LessonResources';

import Map from '../../components/Map/Map';

/**
 * @param {Object} currentClient 
 * @param {Object} programs 
 */

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:8080';

class ClientLessons extends React.Component {

    state={
        currentClient:this.props.currentClient, 
        currentLesson: this.props.currentClient.lessons.find(lesson=>lesson.current === true), //might want to change this to last on the list -
        availablePrograms:this.props.programs,
        displayResources: this.props.programs ? [] : this.props.programs[0].resources, 
        showAddNote:false, showAddHomework:false, animateBar:true,
        mapLocation:null
    }

    componentDidMount(){

        if(this.state.currentLesson){
            this.geoCode();

            //gets an array of all the resource ids that have been applied to all lessons
            let allApplied = [];
            const lessons = this.state.currentClient.lessons;
            lessons.map(lesson=> lesson.resources.map(resource => allApplied.push(resource)));
            
            // adds a key name applied to each resource for all trainer programs
            const programs = [...this.state.availablePrograms];
            programs.map(program => program.resources.map(resource => Object.assign(resource,{applied:false})))

        
            const copyClient = {...this.props.currentClient};

            //adds the resource information for each lesson resource and adds a value of true for applied to the programs
            programs.forEach(program=>
                program.resources.forEach(programResource=>
                    copyClient.lessons.forEach(lesson => 
                        lesson.resources.forEach((resource, i)=> {
                            if(resource.id === programResource.id){
                                //sets a value of true for applied resources
                                programResource.applied=true;
                                //remove the single id
                                lesson.resources.splice(i,1);
                                //replace the resource with the object
                                lesson.resources.push(programResource);
                            }  
                        })
                    )          
                )
            )

            // sets the state to reflect the modified objects
            this.setState({currentClient:copyClient, availablePrograms:programs})
        }
    }

    componentDidUpdate(prevState, prevProps){
        
        if(this.state.availablePrograms.length !==0){
            if(!("applied" in this.state.availablePrograms[0].resources[0])){
            // adds a key name applied to each resource for all trainer programs
            const programs = [...this.state.availablePrograms];
            programs.map(program => program.resources.map(resource => Object.assign(resource,{applied:false})))

        
            const copyClient = {...this.state.currentClient};

            //adds the resource information for each lesson resource and adds a value of true for applied to the programs
            programs.forEach(program=>
                program.resources.forEach(programResource=>
                    copyClient.lessons.forEach(lesson => 
                        lesson.resources.forEach((resource, i)=> {
                            if(resource.id === programResource.id){
                                //sets a value of true for applied resources
                                programResource.applied=true;
                                //remove the single id
                                lesson.resources.splice(i,1);
                                //replace the resource with the object
                                lesson.resources.push(programResource);
                            }  
                        })
                    )          
                )
            )
            this.setState({currentClient:copyClient, availablePrograms:programs, displayResources:programs[0].resources})
            } 
        }

        console.log("client-lessons - componentUpdated")
        if(prevProps.currentLesson){
            if(prevProps.currentLesson.location.address !==this.state.currentLesson.location.address || prevProps.currentLesson.location.city !==this.state.currentLesson.location.city ){
                this.geoCode();
            }
        }
}

    geoCode = () =>{
        const {address, city, province} = this.state.currentLesson.location;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            // console.log(res.data.results[0].locations[0].displayLatLng);
            this.setState({mapLocation:res.data.results[0].locations[0].displayLatLng});     
        })
        .catch(err=>{
            console.log(err);
        })
    }

    //updates the resources that are displayed based on which program is chosen in the available resources section
    updateResources=(program)=>{
       this.setState({displayResources:program.resources});
    }

    //shows the textbox used to add a note or homework when the plus button is clicked
    showForm=(form)=>{
        form === "note" ? this.setState({showAddNote:true}) : this.setState({showAddHomework:true});
    }

    //adds an item to either the homework or the notes lists when the form is submitted
    addListItem=(note, list)=>{

        const newItem={
            note:note
        }

        //determine which form to close based on the target name
        // !!event.target.newNote ? this.setState({showAddNote:false}) : this.setState({showAddHomework:false});
    
        if (list==="addNote"){
            //if the target is the notes section then save it to the appropriate spot in the db
            // const newItem={message:event.target.newNote.value}
            axios.post(`${API_URL}/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addNote`, newItem)
            .then(res =>{
                const lessonCopy = this.state.currentLesson;
                lessonCopy.notes = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            //if the target is the homework section then save it to the appropriate spot in the db
            // console.log(event);
            // const newItem={message:event.target.newHomework.value}
            axios.post(`${API_URL}/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addHomework`, newItem)
            .then(res =>{
                const lessonCopy = this.state.currentLesson;
                lessonCopy.homework = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
  
    //changes the lesson being rendered when a lesson is clicked from top list
    updateCurrentLesson = (lessonId) =>{
        console.log(lessonId);
        const currentLesson = this.props.currentClient.lessons.find(lesson => lesson.id === lessonId);
        this.setState({currentLesson:currentLesson});
    }

    //adds a new empty lesson when +New is clicked and saves it to the db
    addNewLesson = (event) =>{
        event.preventDefault();
        const {lessonName,date,time, locationName,address,city, province, country}=event.target

        const newLesson = {
            name:lessonName.value,
            date:date.value,
            time:time.value,
            location:{
                name:locationName.value,
                address:address.value,
                city:city.value,
                province:province.value,
                country:country.value
            }
        }

        axios.post(`${API_URL}/client/${this.state.currentClient.userId}/addLesson`,newLesson)
        .then(res =>{
            const clientCopy = {...this.state.currentClient};
            clientCopy.lessons.push(res.data)
            this.setState({currentClient:clientCopy, currentLesson: res.data});
        })
        .catch(err=>{
            console.log(err);
        })
    }

    deleteLesson = (lessonId)=>{
       
        axios.delete(`${API_URL}/client/${this.state.currentClient.userId}/${lessonId}/deleteLesson`)
            .then(res =>{
                // console.log(res.data);
                const clientCopy = {...this.state.currentClient};
                clientCopy.lessons = (res.data);
                console.log(clientCopy.lessons);
                this.setState({currentClient:clientCopy, currentLesson:this.props.currentClient.lessons[0]});   
            })
            .catch(err=>{
                console.log(err);
            })
    }

    updateDetails = (event) =>{

        event.preventDefault();
        
        const updatedClient = {
            current:this.state.currentLesson.current,
            name:event.target.lessonName.value,
            date:event.target.date.value,
            time:event.target.time.value,
            location:{
                name:event.target.locationName.value,
                address:event.target.address.value,
                city:event.target.city.value,
                province:event.target.province.value,
                country:event.target.country.value
            }
        }

        axios.put(`${API_URL}/client/${this.state.currentClient.userId}/${this.state.currentLesson.id}/updateLessonDetails`, updatedClient)
        .then(res =>{
            console.log(res);
            const clientCopy = {...this.state.currentClient};
            const index = clientCopy.lessons.findIndex(lesson=>lesson.id === this.state.currentLesson.id);
            clientCopy.lessons.splice(index,1);
            clientCopy.lessons.splice(index, 0, res.data);
            this.setState({currentClient:clientCopy, currentLesson: res.data});
        })
        .catch(err=>{
            console.log(err);
        })
    }

    updateStatus = (event)=>{

        const id = event.target.id;
        console.log(id);
        console.log(this.state.currentLesson.current);
        axios.put(`${API_URL}/client/${this.state.currentClient.userId}/${id}/updateStatus`)
        .then(res =>{
            
            const clientCopy = {...this.state.currentClient};
            const lessonCopy = {...this.state.currentLesson};
            clientCopy.lessons.forEach(lesson => lesson.current = (lesson.id === id) ? true : false);
            lessonCopy.current = true;
            console.log(clientCopy);
            this.setState({currentClient:clientCopy, currentLesson:lessonCopy});
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render(){
        //copy of state saved to variables - unnecessary but saved time when converted to classful component
        const programs = [...this.state.availablePrograms];
        const lessons = [...this.state.currentClient.lessons];
        const currentClient = {...this.state.currentClient};
        const currentLesson = {...this.state.currentLesson};

        console.log(this.state.currentClient);
        console.log(this.state.currentLesson);

        if(lessons.length===0){
            return(                                     
                <div className="empty-container empty-lessons">
                    <div className="empty-lessons__modal">
                        <ModalContainer 
                            modalType = "update" 
                            modalName = "addLesson" 
                            buttonType="image"
                            url="/icons/add-icon.svg"
                            onSubmit={this.addNewLesson} 
                        />
                    </div>
                    <p>Click to Add a Lesson</p>
                </div>
            )
        }else{
            return (
                <div className="lessons">
                    {/* list of all client's lessons - click to render a specific lesson */}
                    <div className="lessons__list">

                    {lessons.map(lesson=> 
                        <GridList 
                            key={lesson.id} 
                            content={{name:lesson.name, date: lesson.date, time:lesson.time, current:lesson.current}}
                            id={lesson.id} 
                            modalName={!lesson.current ? "delete" : "noDelete"}
                            deleteBtn={true}
                            deleteType="modal" 
                            deleteString = {!lesson.current ? lesson.name : "Cannot Delete Next Lesson"}
                            deleteFunction={this.deleteLesson}
                            onClick={this.updateCurrentLesson}
                            updateStatus={this.updateStatus}
                            slider={true}
                        />)}
                        <div className="lessons__list-new">
                            <ModalContainer 
                                modalType = "update" 
                                modalName = "addLesson" 
                                buttonType="image"
                                url="/icons/plus-square.svg"
                                onSubmit={this.addNewLesson} 
                            />
                        </div>
                    </div>

                    {/* displays the chosen lesson set in state */}
                
                    <div className="component current-lesson">
                    <h2 className="component-title">{currentLesson.name}</h2>
                        <div className = "current-lesson__top">
                            {/* shows the details for the lesson */}
                            <div className="current-lesson__top-details">
                                <div className="current-lesson__top-details-text">
                                    <div className="current-lesson__top-details-where">
                                        <p className="current-lesson__top-details-title">Where</p>
                                        <p className="current-lesson__top-details-item">{currentLesson.location.name}</p>
                                        <p className="current-lesson__top-details-item">{`${currentLesson.location.address}, ${currentLesson.location.city}`}</p>
                                    </div>
                                    <div className="current-lesson__top-details-when">
                                        <p className="current-lesson__top-details-title">When</p>
                                        <p className="current-lesson__top-details-item">{`Date: ${currentLesson.date}`}</p>
                                        <p className="current-lesson__top-details-item">{`Time: ${currentLesson.time}`}</p>
                                    </div>
                                </div>
                                {/* modal to update the lesson details */}
                                <div className="current-lesson__top-details-edit">
                                    <ModalContainer 
                                        modalType = "update" 
                                        modalName = "modifyLesson" 
                                        buttonType="image"
                                        url="/icons/edit-icon.svg"
                                        onSubmit={this.updateDetails} 
                                        information={currentLesson}
                                    />
                                </div>
                            </div>
                            
                            <div className = "client__contact-map">
                                <Map
                                    mapLocation={this.state.mapLocation}
                                    containerSize={{width:"346px", height:"268px"}}
                                />
                            </div>
                        </div>

                        <div className="lesson-divider"></div>

                        <h2 className="section-title section-title-resources">Resources</h2>
                        
                        {/* renders the resource section for the lessons */}
                        <LessonResources programs={programs} currentLesson={currentLesson} currentClient={currentClient} match={this.props.match}/>
                
                        {/* renders the notes and the homework section */}
                        <div className="current-lesson__bottom">

                            <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                <div className="client__notes-submit">
                                    <ModalContainer 
                                        modalType = "note" 
                                        modalName = "addNote" 
                                        buttonType="image"
                                        url="/icons/add-note.svg" 
                                        information = {this.state.currentLesson.notes}
                                        onSubmit={this.addListItem} 
                                    />
                                </div>
                                <div className = "client__notes-body">
                                    <p className="client__notes-title">Lesson Notes ...</p>
                                    <div className="client__notes-text"> {this.state.currentLesson.notes}</div>
                                </div>
                            </div>

                            <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                <div className="client__notes-submit">
                                    <ModalContainer 
                                        modalType = "note" 
                                        modalName = "addHomework" 
                                        buttonType="image"
                                        url="/icons/add-note.svg" 
                                        information = {this.state.currentLesson.homework}
                                        onSubmit={this.addListItem} 
                                    />
                                </div>
                                <div className = "client__notes-body">
                                    <p className="client__notes-title">Homework ...</p>
                                    <div className="client__notes-text"> {this.state.currentLesson.homework}</div>
                                </div>    

                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default ClientLessons
