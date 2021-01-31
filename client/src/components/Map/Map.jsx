import React, {useState, useCallback} from 'react';
import {GoogleMap, Marker, InfoWindow, useJsApiLoader} from '@react-google-maps/api';

import mapStyles from '../../mapStyles';

const Map = ({mapLocation, containerSize}) => {
 
    const [showInfo, setShowInfo]=useState(false);
    const [map, setMap] = useState(null);

    const {isLoaded,loadError} = useJsApiLoader({
        id:'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    })

    const onLoad = useCallback(map=>{
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map);
    },[]);

    const onUnmount = useCallback(map=>{
        setMap(null)
    },[]);

    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
      }

    return isLoaded ? (
        <GoogleMap 
            // defaultZoom={10}
            center={mapLocation}
            zoom={10} 
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{styles:mapStyles, zoomControl:false, mapTypeControl:false}}
            mapContainerStyle={containerSize}
        >

        <Marker 
            position={mapLocation} 
            onClick={()=>{setShowInfo(true)}}
            // icon={{
            //     url:"/icons/map-marker.svg",
            //     scaledSize: new window.google.maps.Size(20,40)
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
    ):<></>
}

export default React.memo(Map)
