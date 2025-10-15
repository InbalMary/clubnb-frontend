import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
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

  const [coords, setCoords] = useState(
    isValidCoords ? initialCoords : fallbackCoords
  )
    useEffect(() => {
        if (mapRef.current) {
            setCoords(coords)
        }
    }, [coords])

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
                <AdvancedMarker position={coords ||fallbackCoords }>
                    <HomeMarkerIcon size={48} fill="#222222ff" />


                </AdvancedMarker>
            </Map>
        </>
    )
}
