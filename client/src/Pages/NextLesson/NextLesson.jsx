import React from 'react'

import "./NextLesson.scss";
import Map from '../../components/Map/Map';
import GridList from '../../components/GridList/GridList';

function NextLesson({nextLesson}) {

    console.log(nextLesson);
    return (
    <div className="next-lesson" style={{backgroundImage: "url('/images/main2.jfif')"}}>
        <h1 className="next-lesson__title">NEXT LESSON</h1>
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
                    
                        <div className = "client__contact-map" style={{width:"346px", height:"268px"}}>
                            {/* <Map
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                                loadingElement={<div style={{height: "100%"}} />}
                                containerElement={<div style={{height: "100%"}} />}
                                mapElement={<div style={{height: "100%"}} />}
                                mapLocation={this.state.mapLocation}
                            /> */}
                        </div>
                    </div>
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

                    <div className="">
                        <h2 className="section-title-resources next-lesson__subtitle">Notes</h2>
                        <div className = "client__notes" style={{backgroundImage: "url('/images/notePaper.png')"}}>
                            <div className = "client__notes-body">
                                {/* <p className="client__notes-title">Lesson Notes ...</p> */}
                                <div className="client__notes-text"> {nextLesson.notes}</div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
     </div>
    )
}

export default NextLesson
