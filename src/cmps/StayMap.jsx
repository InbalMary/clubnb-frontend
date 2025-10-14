import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { HomeMarkerIcon } from './SmallComponents';

export function StayMap({ location }) {
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <MapController location={location} />
            </APIProvider>
        </>
    )

}

function MapController({ location }) {
    const { lat, lng } = location

    const [coords, setCoords] = useState({ lat: lat, lng: lng })
console.log('coords:', coords)

    function handleClick(event) {
        const latLng = event.detail.latLng
        setCoords(latLng)
    }
    if (!location) return <div></div>
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
