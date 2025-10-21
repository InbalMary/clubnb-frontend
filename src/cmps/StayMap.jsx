import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { HomeMarkerIcon } from './SmallComponents';

export function StayMap({ location }) {
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <MapController key={`${location?.lat}-${location?.lng}`} location={location} />
            </APIProvider>
        </>
    )

}

function MapController({ location }) {
    const mapRef = useRef(null)

    const fallbackCoords = { lat: -8.6880, lng: 115.2580 }

    // Ensure valid numbers or fallback
    const initialCoords = {
        lat: Number(location?.lat),
        lng: Number(location?.lng),
    }

    const isValidCoords = (
        typeof initialCoords.lat === 'number' &&
        !isNaN(initialCoords.lat) &&
        typeof initialCoords.lng === 'number' &&
        !isNaN(initialCoords.lng)
    )

    const [coords, setCoords] = useState(null)
    useEffect(() => {
        const lat = Number(location?.lat);
        const lng = Number(location?.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
            const newCoords = { lat, lng }
            setCoords(newCoords)

            if (mapRef.current) {
                mapRef.current.panTo(newCoords);
                // setCoords(newCoords)
            }
        }
        // if (mapRef.current) {
        // }
    }, [location])

    function handleClick(event) {
        const latLng = event.detail.latLng
        setCoords(latLng)
    }

    return (
        <>
            <Map defaultCenter={coords || fallbackCoords}
                ref={mapRef}

                defaultZoom={13}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                }}

                style={{ height: '100%', width: '100%' }}
                mapId="4596e122b459cf79cc58b24d"
            >
                <AdvancedMarker position={coords || fallbackCoords}>
                    <div className="home-icon-div">

                        <HomeMarkerIcon size={28} fill="#ffffffff" />
                        <span className="small-square" />
                    </div>


                </AdvancedMarker>
            </Map>
        </>
    )
}
