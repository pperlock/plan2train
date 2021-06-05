import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import './ClientLessons.scss'

import GridList from '../../components/GridList/GridList';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import LessonResources from '../../components/LessonResources/LessonResources';
import PageLayout from  '../../components/PageLayout/PageLayout';
import ClientNav from '../../components/ClientNav/ClientNav';

import Map from '../../components/Map/Map';

import TrainerContext from '../../store/trainer-context';

import {API_URL} from '../../App.js';

const ClientLessons  = () => {

    const {setTrainerId, clients, programs} = useContext(TrainerContext);

    const {trainerId, clientId} = useParams();

    const [currentLesson, setCurrentLesson] = useState(null);
    const [mapLocation, setMapLocation] = useState(null);
    const [currentClient, setCurrentClient] = useState(null);

    useEffect(()=>{
        console.log('lessons updated')
        if (!!clients){
            const findClient = clients.find(client=>client.userId === clientId);
            setCurrentClient(findClient);
            setCurrentLesson(findClient.lessons.find(lesson=>lesson.current))
        }
        setTrainerId(trainerId);
        
        if(currentLesson){
            geoCode();

            //gets an array of all the resource ids that have been applied to all lessons
            let allApplied = [];
            const lessons = currentClient.lessons;
            lessons.map(lesson=> lesson.resources.map(resource => allApplied.push(resource)));
            
            // adds a key name applied to each resource for all trainer programs
            // const programs = [...this.state.availablePrograms];
            programs.map(program => program.resources.map(resource => Object.assign(resource,{applied:false})))
        
            //adds the resource information for each lesson resource and adds a value of true for applied to the programs
            programs.forEach(program=>
                program.resources.forEach(programResource=>
                    currentClient.lessons.forEach(lesson => 
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
        }
    }, [currentClient, currentLesson, clients])

    //old component did update for maps
    //         if(prevProps.currentLesson){
    //             if(prevProps.currentLesson.location.address !==this.state.currentLesson.location.address || prevProps.currentLesson.location.city !==this.state.currentLesson.location.city ){
    //                 this.geoCode();
    //             }
    //         }

    const geoCode = () =>{
        const {address, city, province} = currentLesson.location;
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            // console.log(res.data.results[0].locations[0].displayLatLng);
            // this.setState({mapLocation:res.data.results[0].locations[0].displayLatLng}); 
            setMapLocation(res.data.results[0].locations[0].displayLatLng)    
        })
        .catch(err=>{
            console.log(err);
        })
    }

     //adds an item to either the homework or the notes lists when the form is submitted
    const addListItem = (note, list) =>{

        const newItem={
            note:note
        }
    
        if (list==="addNote"){
            //if the target is the notes section then save it to the appropriate spot in the db

            axios.post(`${API_URL}/client/${clientId}/${currentLesson.id}/addNote`, newItem)
            .then(res =>{
                const lessonCopy = {...currentLesson};
                lessonCopy.notes = res.data;

                const clientCopy = {...currentClient};
                const lessonloc = clientCopy.lessons.findIndex(lesson => lesson.id === currentLesson.id);
                clientCopy.lessons.splice(lessonloc,1,lessonCopy);

                setCurrentClient(clientCopy);
                setCurrentLesson(lessonCopy);
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            //if the target is the homework section then save it to the appropriate spot in the db
            axios.post(`${API_URL}/client/${clientId}/${currentLesson.id}/addHomework`, newItem)
            .then(res =>{
                const lessonCopy = {...currentLesson};
                lessonCopy.homework = res.data;

                const clientCopy = {...currentClient};
                const lessonloc = clientCopy.lessons.findIndex(lesson => lesson.id === currentLesson.id);
                clientCopy.lessons.splice(lessonloc,1,lessonCopy);

                setCurrentLesson(lessonCopy);
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
  
    //changes the lesson being rendered when a lesson is clicked from top list
    const updateCurrentLesson = lessonId =>{
        const currentLesson = currentClient.lessons.find(lesson => lesson.id === lessonId);
        setCurrentLesson(currentLesson);
    }

    //adds a new empty lesson when +New is clicked and saves it to the db
    const addNewLesson = event =>{
        event.preventDefault();
        const {lessonName,date,time, locationName,address,city, province, country} = event.target

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

        axios.post(`${API_URL}/client/${clientId}/addLesson`,newLesson)
        .then(res =>{
            const clientCopy = {...currentClient};
            clientCopy.lessons.push(res.data)
            setCurrentClient(clientCopy);
            setCurrentLesson(res.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const deleteLesson = lessonId =>{
       
        axios.delete(`${API_URL}/client/${clientId}/${lessonId}/deleteLesson`)
            .then(res =>{
                const clientCopy = {...currentClient};
                const lessonLoc = clientCopy.lessons.findIndex(lesson => lesson.id === lessonId);
                clientCopy.lessons.splice(lessonLoc, 1);
                setCurrentClient(clientCopy);
                setCurrentLesson(currentClient.lessons[0]);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    const updateDetails = event =>{

        event.preventDefault();

        const {lessonName, date, time, locationName, address, city, province, country} = event.target;
        
        const updatedLesson = {
            current:currentLesson.current,
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

        axios.put(`${API_URL}/client/${currentClient.userId}/${currentLesson.id}/updateLessonDetails`, updatedLesson)
        .then(res =>{
            const clientCopy = {...currentClient};
            const index = clientCopy.lessons.findIndex(lesson=>lesson.id === currentLesson.id);
            clientCopy.lessons.splice(index,1);
            clientCopy.lessons.splice(index, 0, res.data);
            setCurrentClient(clientCopy);
            setCurrentLesson(res.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const updateStatus = event =>{

        const {id} = event.target;
        axios.put(`${API_URL}/client/${clientId}/${id}/updateStatus`)
        .then(res =>{
            const clientCopy = {...currentClient};
            const lessonCopy = {...currentLesson};
            clientCopy.lessons.forEach(lesson => lesson.current = (lesson.id === id) ? true : false);
            lessonCopy.current = true;
            setCurrentClient(clientCopy);
            setCurrentLesson(lessonCopy);

        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <>
            {clients && <PageLayout> 

                <ClientNav />

                <div className="lessons">
                    {/* list of all client's lessons - click to render a specific lesson */}
                    <div className="lessons__list">

                        {currentClient &&
                            currentClient.lessons.map(lesson=> 
                            <GridList 
                                key={lesson.id} 
                                content={{name:lesson.name, date: lesson.date, time:lesson.time, current:lesson.current}}
                                id={lesson.id} 
                                modalName={!lesson.current ? "delete" : "noDelete"}
                                deleteBtn={true}
                                deleteType="modal" 
                                deleteString = {!lesson.current ? lesson.name : "Cannot Delete Next Lesson"}
                                deleteFunction={deleteLesson}
                                onClick={updateCurrentLesson}
                                updateStatus={updateStatus}
                                slider={true}
                            />)
                        }

                        <div className="lessons__list-new">
                            <ModalContainer 
                                modalType = "update" 
                                modalName = "addLesson" 
                                buttonType="image"
                                url="/icons/plus-square.svg"
                                onSubmit={addNewLesson} 
                            />
                        </div>
                    </div>

                    {/* displays the chosen lesson set in state */}
                
                    {currentLesson && 
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
                                            onSubmit={updateDetails} 
                                            information={currentLesson}
                                        />
                                    </div>
                                </div>
                                
                                <div className = "client__contact-map">
                                    <Map
                                        mapLocation={mapLocation}
                                        containerSize={{width:"346px", height:"268px"}}
                                    />
                                </div>
                            </div>

                            <div className="lesson-divider"></div>

                            <h2 className="section-title section-title-resources">Resources</h2>
                            
                            {/* renders the resource section for the lessons */}
                            <LessonResources programs={programs} currentLesson={currentLesson} currentClient={currentClient}/>
                    
                            {/* renders the notes and the homework section */}
                            <div className="current-lesson__bottom">
                                <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                    <div className="client__notes-submit">
                                        <ModalContainer 
                                            modalType = "note" 
                                            modalName = "addNote" 
                                            buttonType="image"
                                            url="/icons/add-note.svg" 
                                            information = {currentLesson.notes}
                                            onSubmit={addListItem} 
                                        />
                                    </div>
                                    <div className = "client__notes-body">
                                        <p className="client__notes-title">Lesson Notes ...</p>
                                        <div className="client__notes-text"> {currentLesson.notes}</div>
                                    </div>
                                </div>

                                <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                                    <div className="client__notes-submit">
                                        <ModalContainer 
                                            modalType = "note" 
                                            modalName = "addHomework" 
                                            buttonType="image"
                                            url="/icons/add-note.svg" 
                                            information = {currentLesson.homework}
                                            onSubmit={addListItem} 
                                        />
                                    </div>
                                    <div className = "client__notes-body">
                                        <p className="client__notes-title">Homework ...</p>
                                        <div className="client__notes-text"> {currentLesson.homework}</div>
                                    </div>    

                                </div>
                            </div>
                        </div>
                    }
                </div>
            </PageLayout> 
            }
        </>
    )
}

export default ClientLessons
