import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { StayPreview } from './StayPreview';
import { useClickOutside } from '../customHooks/useClickOutside';
export function ExploreMap({ locations }) {
    return (
        <div className="explore-map-wrapper">

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <ExploreMapController locations={locations} />
            </APIProvider>
        </div>
    )

}

function ExploreMapController({ locations }) {

    const [activeLocation, setActiveLocation] = useState(null)

    const mapRef = useRef(null)
    const markerRefs = useRef({})
    const modalRef = useRef(null)

    const [hoveredId, setHoveredId] = useState(null);
    const attachedMarkers = useRef(new Set())

    useEffect(() => {
        Object.entries(markerRefs.current).forEach((id, marker) => {
            if (marker && !attachedMarkers.current[id]) {
                // marker.addListener('click', () => setActiveLocation(locations.find(l => l._id === id)))
                attachedMarkers.current.add(id)
            }
        })
    }, [locations])

    // useClickOutside([modalRef], () => setActiveLocation(null))

    function handleMouseEnter(id) {
        setHoveredId(id);
        Object.entries(markerRefs.current).forEach(([key, marker]) => {
            if (marker) marker.zIndex = key === id ? 999 : 1

        })
    }

    function handleMouseLeave() {
        setHoveredId(null);
        Object.values(markerRefs.current).forEach(marker => {
            if (marker) marker.zIndex = 1;
        })
    }

    const map = useMap()

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
                defaultZoom={7}
                options={{

                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                }}

                style={{ height: '100%', width: '100%' }}
                mapId="4596e122b459cf79cc58b24d"
            >
                {locations?.map((location, idx) => (


                    < AdvancedMarker key={idx} position={{ lat: location?.loc.lat, lng: location?.loc.lng }}
                        ref={(el) => markerRefs.current[location._id] = el}
                        onClick={() => {
                            // e.stopPropagation();
                            setActiveLocation(location)
                        }}
                        onMouseEnter={() => handleMouseEnter(location._id)}
                        onMouseLeave={handleMouseLeave}


                    >
                        {/* onClick={() => {
                        //     // e.stopPropagation();
                        //     setActiveLocation(location)
                        // }}
                        // onMouseEnter={() => handleMouseEnter(location._id)}
                        // onMouseLeave={handleMouseLeave} */}
                        <div className={`marker-wrapper ${hoveredId === location._id ? 'hovered' : ''}`}>
                            <span className="marker btn-pill">${location.price}</span>
                        </div>
                        {/* <span
                            key={location.price} className={`marker btn-pill ${hoveredId === location._id ? 'hovered' : ''}`}>
                            ${location.price}

                        </span> */}

                        {activeLocation?._id === location._id &&
                            <Modal
                                ref={modalRef}
                                header=" "
                                isOpen={activeLocation}
                                onClose={() => setActiveLocation(null)}
                                closePosition="right"
                                className={`map-stay-preview`}
                                useBackdrop={false}>
                                <StayPreview key={location._id} stay={location} isBig={true} />
                            </Modal>
                        }

                    </AdvancedMarker>
                )
                )}
            </Map >
        </>
    )
}