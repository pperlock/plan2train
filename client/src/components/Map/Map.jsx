import React, {useState, useEffect} from 'react';
import {GoogleMap, Marker, InfoWindow,withGoogleMap, withScriptjs} from 'react-google-maps';
import axios from 'axios';

import mapStyles from '../../mapStyles';

const Map = withScriptjs(withGoogleMap(({mapLocation}) => {
 
    console.log(mapLocation);
    const [showInfo, setShowInfo]=useState(false);

    if(!mapLocation){
        return(
            <div> Loading Map ...</div>
        )
    }else{
        return (
                <GoogleMap 
                    defaultZoom={12} 
                    center={{lat:mapLocation.lat, lng:mapLocation.lng}}
                    defaultOptions={{styles:mapStyles, zoomControl:false, mapTypeControl:false}}
                    onClick={()=>console.log(mapLocation)}
                >

                <Marker 
                    position={{lat:mapLocation.lat, lng:mapLocation.lng}} 
                    onClick={()=>{setShowInfo(true)}}
                    // icon={{
                    //     url:"/icons/facebook-icon.svg",
                    //     scaledSize: new window.google.maps.Size(40,40)
                    // }}
                /> 
            

            {showInfo &&
                <InfoWindow 
                    position={{lat:mapLocation.lat, lng:mapLocation.lng}}
                    onCloseClick={()=>{setShowInfo(false)}}
                    >
                    <div>
                        <h2>Lesson details</h2>
                        <p> Lesson Name</p>
                    </div>
                </InfoWindow>
            }
            </GoogleMap>
        )
    }
    }
));

export default Map
