import { useState, useCallback } from "react";
import { Map, AdvancedMarker, APIProvider } from "@vis.gl/react-google-maps";

export function StepMapConfirm({ address, location, setLocation }) {
    const [markerPosition, setMarkerPosition] = useState(location)

    const handleMarkerDrag = useCallback((e) => {
        const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }
        setMarkerPosition(newPos)
        setLocation(newPos)
    }, [setLocation])

    return (
        <main className="step-location-content">
            <div className="location-header">
                <h1 className="location-title">Is the pin in the right spot?</h1>
                <p className="location-subtitle">
                    Your address is only shared with guests after they've made a reservation.
                </p>
            </div>

            <div className="location-map-wrapper">
                <div className="location-search-container">
                    <div className="location-search-box">
                        <span className="location-icon">
                            <img src={`/img/step3/map-address.svg`} alt="map-address" className="step4-icon" />
                        </span>
                        <span className="location-address-text">{address}</span>
                    </div>
                </div>

                <div className="map-container">
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        <Map
                            center={markerPosition}
                            zoom={15}
                            mapId="map-confirm"
                            disableDefaultUI
                            gestureHandling="greedy"
                            style={{ height: "100%", width: "100%" }}
                        >
                            <AdvancedMarker
                                position={markerPosition}
                                draggable={true}
                                onDragEnd={handleMarkerDrag}
                            />
                        </Map>
                    </APIProvider>

                    <div className="map-drag-hint">
                        <span>Drag the map to reposition the pin</span>
                    </div>
                </div>
            </div>
        </main>
    )
}