import React, {useState,useEffect}from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import {API_URL} from '../../App.js';

import "./NextLesson.scss";

import Map from '../../components/Map/Map';
import GridList from '../../components/GridList/GridList';

function NextLesson() {

    // store the geocoded (lat,long) location of the map in state
    const [mapLocation, setMapLocation] = useState(null);

    const [nextLesson, setNextLesson] = useState(null);

    const {clientId} = useParams();
    
    useEffect(()=>{
        
        axios.get(`${API_URL}/api/client/${clientId}`)
        .then(res =>{
            setNextLesson(res.data.lessons.find(lesson=> lesson.current===true));
        })
        .catch(err => {
            console.log(err)
        })
        
        //send the location of the next lesson to the api to geocode the location for google maps
        axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.REACT_APP_MAPQUEST_API}&street=${address}&city=${city}&state=${province}`)
        .then(res=>{
            //once the location is geocoded set it in state
            setMapLocation(res.data.results[0].locations[0].displayLatLng);
        })
        .catch(err=>{
            console.log(err);
        })
    },[])
    
    const {address, city, province} = nextLesson ? nextLesson.location : {};

    return (
    <div className="next-lesson" style={{backgroundImage: "url('/images/main2.jfif')"}}>
        <h1 className="next-lesson__title">NEXT LESSON</h1>
        {nextLesson &&
        <div className="component next-lesson__container">
            <h2 className="component-title">{nextLesson.name}</h2>
                <div className = "current-lesson__top next-lesson__top">
                    {/* shows the details for the lesson */}
                    <div className="next-lesson__top-left">
                    <h2 className="section-title-resources next-lesson__subtitle">Details</h2>
                        <div className="current-lesson__top-details next-lesson__top-details">
                            <div className="current-lesson__top-details-text">
                                <div className="current-lesson__top-details-where">
                                    <p className="current-lesson__top-details-title">Where</p>
                                    <p className="current-lesson__top-details-item next-lesson__location">{nextLesson.location.name}</p>
                                    <p className="current-lesson__top-details-item">{`${nextLesson.location.address}, ${nextLesson.location.city}`}</p>
                                </div>
                                <div className="current-lesson__top-details-when">
                                    <p className="current-lesson__top-details-title">When</p>
                                    <p className="current-lesson__top-details-item">{`Date: ${nextLesson.date}`}</p>
                                    <p className="current-lesson__top-details-item">{`Time: ${nextLesson.time}`}</p>
                                </div>
                            </div>
                        </div>
                    
                        {/* render the google map for the lesson location */}
                        <div className = "client__contact-map">
                            <Map
                                mapLocation={mapLocation}
                                containerSize={{width:"346px", height:"282px"}}
                            />
                        </div>
                    </div>
                    
                    {/* render the resources for the next lesson */}
                    <div className="next-lesson__resources">
                        <h2 className="section-title-resources next-lesson__subtitle">Resources</h2>
                        <div className="next-lesson__resources-list">
                            {nextLesson.resources.map(resource=> 
                                <GridList 
                                    key={resource.id} 
                                    content={resource.name}
                                    resourceType={resource.type} 
                                    id={resource.id} 
                                    link={resource.url} 
                                    description={resource.type} 
                                    deleteBtn={false}
                                    deleteType="noDelete" 
                                    slider={true}
                                />)}
                        </div>
                    </div>

                    {/* render notes for the next lesson */}
                    <div className="">
                        <h2 className="section-title-resources next-lesson__subtitle">Notes</h2>
                        <div className = "client__notes client-side__notepaper-next" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                            <div className = "client__notes-body client-side__notes">
                                <div className="client__notes-text"> {nextLesson.notes}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
     </div>
    )
}

export default NextLesson
