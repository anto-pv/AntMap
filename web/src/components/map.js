import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React from 'react';

const Map =() =>{
    const uluru = { lat: 10.0603, lng: 76.6352 };
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_API,
    });
    if (!isLoaded) return <div>Loading...</div>;
    return (
        <div className='map'><GoogleMap zoom={14} center={uluru} mapContainerClassName="map"></GoogleMap></div>
    );
};
export default Map;