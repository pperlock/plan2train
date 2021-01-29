import React from 'react';
import axios from 'axios';

import './ClientLessons.scss'

import List from '../../components/List/List';
import GridList from '../../components/GridList/GridList';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import LessonResources from '../../components/LessonResources/LessonResources';

import Map from '../../components/Map/Map';

/**
 * @param {Object} currentClient 
 * @param {Object} programs 
 */

class ClientLessons extends React.Component {

    state={
        currentClient:this.props.currentClient, 
        currentLesson: this.props.currentClient.lessons.find(lesson=>lesson.current === true), //might want to change this to last on the list -
        availablePrograms:this.props.programs,
        displayResources:this.props.programs[0].resources, 
        showAddNote:false, showAddHomework:false, animateBar:true,
        mapLocation:null
    }

    componentDidMount(){

        this.geoCode();

        //gets an array of all the resource ids that have been applied to all lessons
        let allApplied = [];
        const lessons = this.state.currentClient.lessons;
        lessons.map(lesson=> lesson.resources.map(resource => allApplied.push(resource)));
        
        //adds a key name applied to each resource for all trainer programs
        const programs = this.props.programs;
        programs.map(program => program.resources.map(resource => Object.assign(resource,{applied:false})))

       
        const copyClient = {...this.props.currentClient};

        //adds the resource information for each lesson resource and adds a value of true for applied to the programs- stored only as ids in the client document in db
        this.props.programs.forEach(program=>
            program.resources.forEach(programResource=>
                copyClient.lessons.forEach(lesson => 
                    lesson.resources.forEach((resource, i)=> {
                        if(resource === programResource.id){
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
        this.setState({currentClient:copyClient, availablePrograms:programs});
    }

    componentDidUpdate(prevProp, prevState){
        console.log("client-lessons - componentUpdated")
        // console.log(prevProp);
        // console.log(prevState);
        if(prevState.currentLesson.location.address !==this.state.currentLesson.location.address){
            this.geoCode();
        }
    }

    geoCode = () =>{
        const {address, city, province} = this.state.currentLesson.location;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=amHyO923YUE511fynEWxbf7Gf5S45VRP&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            console.log(res.data.results[0].locations[0].displayLatLng);
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
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addNote`, newItem)
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
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addHomework`, newItem)
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

    // //deletes an item from either the homework or the notes lists when the form is submitted
    // deleteListItem=(event, list)=>{
    //     const lessonCopy = {...this.state.currentLesson};
    //     // list variable passed in is used to determine what list to delete the item from
    //     if (list==="notes"){
    //         axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteNote`)
    //         .then(res =>{
    //             lessonCopy.notes = res.data;
    //             this.setState({currentLesson:lessonCopy});
    //         })
    //         .catch(err=>{
    //             console.log(err);
    //         })
    //     }else{
    //         axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteHomework`)
    //         .then(res =>{
    //             lessonCopy.homework = res.data;
    //             this.setState({currentLesson:lessonCopy});
    //         })
    //         .catch(err=>{
    //             console.log(err);
    //         })
    //     }
    // }
  
    //changes the lesson being rendered when a lesson is clicked from top list
    updateCurrentLesson = (lessonId) =>{
        console.log(lessonId);
        const currentLesson = this.props.currentClient.lessons.find(lesson => lesson.id === lessonId);
        this.setState({currentLesson:currentLesson});
    }

    //adds a new empty lesson when +New is clicked and saves it to the db
    addNewLesson = () =>{
        axios.post(`http://localhost:8080/client/${this.state.currentClient.userId}/addLesson`)
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
        console.log(lessonId);
        
        axios.delete(`http://localhost:8080/client/${this.state.currentClient.userId}/${lessonId}/deleteLesson`)
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

        console.log(this.state.currentLesson.name);
        axios.put(`http://localhost:8080/client/${this.state.currentClient.userId}/${this.state.currentLesson.id}/updateLessonDetails`, updatedClient)
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

    updateStatus = ()=>{
           
        axios.put(`http://localhost:8080/client/${this.state.currentClient.userId}/${this.state.currentLesson.id}/updateStatus`)
        .then(res =>{
            
            const clientCopy = {...this.state.currentClient};
            const lessonCopy = {...this.state.currentLesson};
            clientCopy.lessons.map(lesson => lesson.current = (lesson.id === this.state.currentLesson.id) ? true : false);
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

        console.log(currentLesson.current);

        console.log(this.props);

        if(lessons.length === 0){
            return(                                     
                <div onClick={this.addNewLesson} className="empty-container">
                    <img className="empty-container__icon" src="/icons/add-icon.svg" alt="add icon"></img>
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
                            deleteString = {!lesson.current ? lesson.name : "Cannot Delete Current Lesson"}
                            deleteFunction={this.deleteLesson}
                            onClick={this.updateCurrentLesson}
                            updateStatus={this.updateStatus}
                        />)}
                        <p className="lessons__list-new" onClick={this.addNewLesson}> + New </p>
                    </div>

                    {/* displays the chosen lesson set in state */}
                
                    <div className="component current-lesson">
                    <h2 className="component-title">{currentLesson.name}</h2>
                        <div className = "current-lesson__top">
                            {/* {currentLesson.current ? 
                            <p className="current-lesson__top-status current-lesson__top-status--current">Current</p> 
                            : 
                            <p className="current-lesson__top-status" onClick={this.updateStatus}>Mark as Current</p>} */}

                            {/* <div className="current-lesson__top-status">
                                <input onClick={this.updateStatus} className="current-lesson__top-status-check" type="checkbox" id="current"/>
                                <div className={currentLesson.current ? "slidinggroove slidinggroove-on" : "slidinggroove"}></div>
                                <label className="current-lesson__top-status" htmlFor="current" name="current"><p className="current-lesson__top-status-label"> Current</p></label>
                            </div> */}

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
                                    {/* <p>{currentLesson.current ? "current" : "Not"}</p> */}
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
                            
                            <div className = "client__contact-map" style={{width:"346px", height:"268px"}}>
                                <Map
                                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                                    loadingElement={<div style={{height: "100%"}} />}
                                    containerElement={<div style={{height: "100%"}} />}
                                    mapElement={<div style={{height: "100%"}} />}
                                    mapLocation={this.state.mapLocation}
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
                                <div className = "client__notes-body">
                                    <p className="client__notes-title">Lesson Notes ...</p>
                                    <div className="client__notes-text"> {this.state.currentLesson.notes}</div>
                                    <div className="client__notes-submit">
                                        <ModalContainer 
                                            modalType = "note" 
                                            modalName = "addNote" 
                                            buttonText="Add" 
                                            buttonType="accent"
                                            information = {this.state.currentLesson.notes}
                                            onSubmit={this.addListItem} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                <div className = "client__notes-body">
                                    <p className="client__notes-title">Homework ...</p>
                                    <div className="client__notes-text"> {this.state.currentLesson.homework}</div>
                                    <div className="client__notes-submit">
                                        <ModalContainer 
                                            modalType = "note" 
                                            modalName = "addHomework" 
                                            buttonText="Add" 
                                            buttonType="accent"
                                            information = {this.state.currentLesson.homework}
                                            onSubmit={this.addListItem} 
                                        />
                                    </div>
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
