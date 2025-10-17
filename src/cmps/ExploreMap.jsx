import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { StayPreview } from './StayPreview'
import { useClickOutside } from '../customHooks/useClickOutside'
export function ExploreMap({ locations, hoveredId }) {
    return (
        <div className="explore-map-wrapper">

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <ExploreMapController locations={locations} hoveredId={hoveredId} />
            </APIProvider>
        </div>
    )
}

function ExploreMapController({ locations, hoveredId }) {

    const [activeLocation, setActiveLocation] = useState(null)

    const mapRef = useRef(null)
    const markerRefs = useRef({})
    const modalRef = useRef(null)

    const [hoverMarker, setHoverMarker] = useState(null)
    const attachedMarkers = useRef(new Set())


    // Following changes in locations for setting zoom
    useEffect(() => {
        if (mapRef.current && locations?.length) {
            fitMapToLocations(mapRef.current, locations)
        }
    }, [locations])

    // Opening modal on click

    useEffect(() => {
        Object.entries(markerRefs.current).forEach(([id, marker]) => {
            if (marker && !attachedMarkers.current[id]) {
                marker?.addListener('click', () => setActiveLocation(locations?.find(l => l._id === id)))
                attachedMarkers.current.add(id)
            }
        })
    }, [locations])

    // Make every marker pop on hover in front of another

    useEffect(() => {
        Object.entries(markerRefs.current).forEach(([id, marker]) => {
            if (!marker) return
            marker.zIndex = id === hoveredId ? 999 : 1
        })
    }, [hoveredId])

    function handleMouseEnter(id) {
        setHoverMarker(id)
        Object.entries(markerRefs.current).forEach(([key, marker]) => {
            if (marker) marker.zIndex = key === id ? 999 : 1
            else if (marker) marker.zIndex = key === hoveredId ? 999 : 1
        })
    }

    function handleMouseLeave() {
        setHoverMarker(null)
        Object.values(markerRefs.current).forEach(marker => {
            if (marker) marker.zIndex = 1
        })
    }

    // Locations center for map

    const getLocationsCenter = (locations) => {
        if (locations?.length) {

            let latSum = 0
            let lngSum = 0

            locations.forEach(loc => {
                latSum += loc.loc.lat
                lngSum += loc.loc.lng
            })

            return {
                lat: latSum / locations.length,
                lng: lngSum / locations.length,
            }
        }
    }

    // Locations zoom 

    const getLocationsZoom = (locations) => {
        if (!locations?.length) return 6

        let minLat = Infinity, maxLat = -Infinity
        let minLng = Infinity, maxLng = -Infinity

        locations.forEach(loc => {
            minLat = Math.min(minLat, loc.loc.lat)
            maxLat = Math.max(maxLat, loc.loc.lat)
            minLng = Math.min(minLng, loc.loc.lng)
            maxLng = Math.max(maxLng, loc.loc.lng)
        })

        const latDiff = maxLat - minLat
        const lngDiff = maxLng - minLng
        const maxDiff = Math.max(latDiff, lngDiff)

        // Zoom variations based on center

        if (maxDiff < 0.05) return 14
        if (maxDiff < 0.2) return 12
        if (maxDiff < 1) return 9
        if (maxDiff < 5) return 6
        return 3
    }


    // Handle loading map

    const handleMapLoad = (mapInstance) => {
        mapRef.current = mapInstance

        if (locations?.length) {
            fitMapToLocations(mapInstance, locations)
        }
    }

    function fitMapToLocations(map, locations) {
        if (!map || !locations?.length) return

        const bounds = new window.google.maps.LatLngBounds()
        locations.forEach(loc => bounds.extend({ lat: loc.loc.lat, lng: loc.loc.lng }))

        map.fitBounds(bounds)

        // Cap zoom
        const listener = window.google.maps.event.addListenerOnce(map, "bounds_changed", () => {
            const zoom = map.getZoom()
            map.setZoom(Math.min(Math.max(zoom, 3), 15)) // keep between 3–15
        })

        // Cleanup
        return () => window.google.maps.event.removeListener(listener)
    }

    const center = getLocationsCenter(locations)
    const zoom = getLocationsZoom(locations)


    if (!mapRef) return 
    // if (!mapRef) return <ExploreSkeleton stays={locations} />

    return (
        <>
            <Map onLoad={handleMapLoad}
                // center={center}
                ref={mapRef}
                // zoom={zoom}
                defaultZoom={zoom}
                defaultCenter={center}
                options={{

                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: true,
                }}

                style={{ height: '100%', width: '100%' }}
                mapId="4596e122b459cf79cc58b24d"
            >
                {locations?.map((location, idx) => (


                    < AdvancedMarker key={idx} position={{ lat: location?.loc.lat, lng: location?.loc.lng }}
                        ref={(el) => markerRefs.current[location._id] = el}
                        onClick={(e) => {
                            e.domEvent.stopPropagation()
                            setActiveLocation(location)
                        }}
                        onMouseEnter={() => handleMouseEnter(location._id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className={`marker-wrapper ${hoverMarker === location._id ? 'hovered' : ''} ${hoveredId === location._id ? 'hovered-outside' : ''}`}>
                            <span className={`marker btn-pill ${activeLocation?._id === location._id ? 'active' : ''}`}>${location.price}</span>
                        </div>

                        {activeLocation?._id === location._id &&
                            <Modal
                                ref={modalRef}
                                header=" "
                                isOpen={activeLocation !== null}
                                onClose={(e) => {
                                    e?.stopPropagation?.()
                                    setActiveLocation(null)
                                }}
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