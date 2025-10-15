import { useState, useRef, useEffect } from "react";
import { Map, AdvancedMarker, APIProvider } from "@vis.gl/react-google-maps";

export function StepLocation({ address, setAddress, location, setLocation }) {
    const searchBoxRef = useRef(null)
    const inputRef = useRef(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const geocoderRef = useRef(null)
    const autocompleteServiceRef = useRef(null)

    useEffect(() => {
        if (window.google?.maps?.Geocoder) {
            geocoderRef.current = new window.google.maps.Geocoder()
        }

        if (window.google?.maps?.places?.AutocompleteService) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
        }
    }, [])

    const handleInputChange = (ev) => {
        const value = ev.target.value
        setAddress(value)
        setShowDropdown(true)

        if (autocompleteServiceRef.current && value) {
            autocompleteServiceRef.current.getPlacePredictions(
                {
                    input: value,
                    types: ["address"],
                    componentRestrictions: { country: "il" },
                },
                (predictions, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        predictions
                    ) {
                        setSuggestions(predictions)
                    } else {
                        setSuggestions([])
                    }
                }
            );
        } else {
            setSuggestions([])
        }
    }

    const handleFocus = () => setShowDropdown(true)

    const handleClickOutside = (ev) => {
        if (searchBoxRef.current && !searchBoxRef.current.contains(ev.target)) {
            setShowDropdown(false)
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const handlePredictionSelect = (prediction) => {
        if (!geocoderRef.current) return

        geocoderRef.current.geocode({ placeId: prediction.place_id }, (results, status) => {
            if (status === "OK" && results[0]) {
                const loc = results[0].geometry.location
                setLocation({ lat: loc.lat(), lng: loc.lng() })
                setAddress(results[0].formatted_address)
                setSuggestions([])
                setShowDropdown(false)
            }
        })
    }

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) return alert("Geolocation not supported.");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude
                setLocation({ lat, lng })

                if (geocoderRef.current) {
                    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
                        setAddress(
                            status === "OK" && results?.[0]?.formatted_address
                                ? results[0].formatted_address
                                : "Current Location"
                        )
                    })
                } else {
                    setAddress("Current Location");
                }

                setSuggestions([])
                setShowDropdown(false)
            },
            () => alert("Unable to get your location.")
        )
    }

    return (
        <main className="step-location-content">
            <div className="location-header">
                <h1 className="location-title">Where's your place located?</h1>
                <p className="location-subtitle">
                    Your address is only shared with guests after they've made a reservation.
                </p>
            </div>

            <div className="location-map-wrapper">
                <div className="location-search-container" ref={searchBoxRef}>
                    <div className="location-search-box">
                        <span className="location-icon">
                            <img
                                src={`/img/step3/map-address.svg`}
                                alt="map-address"
                                className="step4-icon"
                            />
                        </span>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Enter your address"
                            value={address}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className="location-input"
                            autoComplete="off"
                        />
                    </div>

                    {showDropdown && (
                        <div className="location-dropdown">
                            {/* Use current location */}
                            <button
                                className="location-dropdown-item current-location"
                                type="button"
                                onClick={handleCurrentLocation}
                            >

                                <img
                                    src={`/img/step3/cur-loc.svg`}
                                    alt="current location"
                                    className="step4-icon"
                                />
                                <span>Use my current location</span>
                            </button>

                            {suggestions.length > 0 && <div className="dropdown-divider"></div>}

                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.place_id}
                                    type="button"
                                    className="location-dropdown-item"
                                    onClick={() => handlePredictionSelect(suggestion)}
                                >
                                    <img
                                        src={`/img/step3/loc.svg`}
                                        alt="current location"
                                        className="step4-icon"
                                    /> <span>{suggestion.description}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="map-container">
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                        <Map
                            center={location}
                            zoom={13}
                            mapId="map-edit"
                            disableDefaultUI
                            gestureHandling="greedy"
                            style={{ height: "100%", width: "100%" }}
                        >
                            <AdvancedMarker position={location} />
                        </Map>
                    </APIProvider>
                </div>
            </div>
        </main>
    )
}


