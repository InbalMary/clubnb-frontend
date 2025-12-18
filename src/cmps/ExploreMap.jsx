import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { StayPreview } from './StayPreview'
import { useClickOutside } from '../customHooks/useClickOutside'

export function ExploreMap({ locations, hoveredId, onToggleWishlist, customMarker, isWishlistMap = false, mobilePreviewOpen, setMobilePreviewOpen }) {

    const [activeLocation, setActiveLocation] = useState(null)
    // const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
    const [hoverMarker, setHoverMarker] = useState(null)
    const [center, setCenter] = useState(null)
    const [focusedStayId, setFocusedStayId] = useState(null)

    const mapRef = useRef(null)
    const markerRefs = useRef({})
    const modalRef = useRef(null)

    const attachedMarkers = useRef(new Set())
    const [zoom, setZoom] = useState(10)

    const previewRef = useRef(null)

    useClickOutside([previewRef], () => {
        setFocusedStayId(null)
    })

    // Following changes in locations for setting zoom
    useEffect(() => {
        if (!locations?.length) return
        if (mapRef.current && locations?.length) {
            // fitMapToLocations(mapRef.current, locations) //
            const calculatedCenter = getLocationsCenter(locations)
            setCenter(calculatedCenter)
            const calculatedZoom = getLocationsZoom(locations)
            setZoom(calculatedZoom)
        }

    }, [locations])

    useEffect(() => {
        if (!locations?.length) return
        const calculatedCenter = getLocationsCenter(locations)
        setCenter(calculatedCenter)
        const calculatedZoom = getLocationsZoom(locations)
        setZoom(calculatedZoom)

    }, [locations])


    // Opening modal on click
    useEffect(() => {
        attachMarkerListeners()
    }, [locations])

    // Make  marker pop on hover in front of another from stay preview
    useEffect(() => {
        if (hoveredId) updateMarkerZIndexes({ hoverId: hoveredId })

    }, [hoveredId])

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 743 && mobilePreviewOpen) setMobilePreviewOpen(false)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [mobilePreviewOpen])

    const handleMouseEnter = (id) => {
        setHoverMarker(id)
        updateMarkerZIndexes({ hoverId: id })
    }

    const handleMouseLeave = () => {
        setHoverMarker(null)
        updateMarkerZIndexes({})
    }

    function updateMarkerZIndexes({ activeId = null, hoverId = null }) {
        Object.entries(markerRefs.current).forEach(([key, marker]) => {
            if (!marker) return
            if (key === activeId) marker.zIndex = 999
            else if (key === hoverId) marker.zIndex = 500
            else marker.zIndex = 1
        })
    }

    function attachMarkerListeners() {
        Object.entries(markerRefs.current).forEach(([id, marker]) => {
            if (marker && !attachedMarkers.current.has(id)) {
                marker.addListener("click", () => handleMarkerClick(id))
                attachedMarkers.current.add(id)
            }
        })
    }

    function handleMarkerClick(id) {
        const location = locations?.find((l) => l._id === id)
        if (!location) return

        setActiveLocation(location)
        updateMarkerZIndexes({ activeId: id })

        // Mobile behavior: open custom modal instead of InfoWindow
        if (typeof window !== 'undefined' && window.innerWidth <= 743) {
            setMobilePreviewOpen(true)
            return
        }
    }

    // Locations center for map
    function getLocationsCenter(locations) {
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

    function getLocationsZoom(locations) {
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

    function handleMapLoad(mapInstance, locations) {
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
            map.setZoom(Math.min(Math.max(zoom, 3), 15))
        })
        // Cleanup
        return () => window.google.maps.event.removeListener(listener)
    }


    if (!mapRef) return
    if (!center || !zoom) {
        return <div className="explore-map-wrapper">Loading map...</div>
    }

    return (
        <div className="explore-map-wrapper">

            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>

                <Map onLoad={handleMapLoad}
                    ref={mapRef}
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

                        < AdvancedMarker
                            key={idx}
                            position={{ lat: location?.loc.lat, lng: location?.loc.lng }}
                            ref={(el) => markerRefs.current[location._id] = el}
                            onClick={() => {
                                handleMarkerClick(location._id)
                            }}
                            onMouseEnter={() => handleMouseEnter(location._id)
                            }
                            onMouseLeave={handleMouseLeave}
                        >
                            {customMarker ? (
                                customMarker(location, {
                                    isActive: activeLocation?._id === location._id,
                                    isHovered: hoverMarker === location._id || hoveredId === location._id
                                })
                            ) : (
                                <div className={`marker-wrapper 
                            ${hoverMarker === location._id ? 'hovered' : ''} 
                            ${hoveredId === location._id ? 'hovered-outside' : ''}
                            `}
                                >
                                    <span
                                        className={`marker btn-pill 
                                ${activeLocation?._id === location._id ? 'active' : ''}`}
                                    >${location.price}
                                    </span>
                                </div>
                            )}

                            {activeLocation && activeLocation._id === location._id && (
                                <InfoWindow
                                    options={{
                                        disableDefaultUI: true
                                    }}
                                    className={`${mobilePreviewOpen ? 'mobile' : ''}`}
                                    position={{ lat: activeLocation.loc.lat, lng: activeLocation.loc.lng }}
                                    onCloseClick={() => { setActiveLocation(null); setMobilePreviewOpen(false) }}
                                >
                                    <StayPreview
                                        key={activeLocation._id}
                                        stay={activeLocation}
                                        isBig={true}
                                        onToggleWishlist={onToggleWishlist}
                                        hideDetails={isWishlistMap}
                                        isFocused={focusedStayId === activeLocation._id}
                                        onRequestFocus={() => setFocusedStayId(activeLocation._id)} />
                                </InfoWindow>)}

                        </AdvancedMarker>
                    )
                    )}
                </Map >
            </APIProvider>
        </div >
    )
}

