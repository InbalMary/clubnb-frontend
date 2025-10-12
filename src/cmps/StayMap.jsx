import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { HomeMarkerIcon } from './SmallComponents';

export function StayMap() {
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <MapController />
            </APIProvider>
        </>
    )

}

function MapController() {
    const position = { lat: 53.54992, lng: 10.00678 }
    const [coords, setCoords] = useState({ lat: 32.0853, lng: 34.7818 })



    function handleClick(event) {
        const latLng = event.detail.latLng
        setCoords(latLng)
    }

    return (
        <>
            <Map defaultCenter={coords}
                defaultZoom={13}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                }}

                style={{ height: '100%', width: '100%' }}
                mapId="4596e122b459cf79cc58b24d"
            >
                <AdvancedMarker position={coords}>
                    <HomeMarkerIcon size={48} fill="#222222ff" />


                </AdvancedMarker>
            </Map>
        </>
    )
}
