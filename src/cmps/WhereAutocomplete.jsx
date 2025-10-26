import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { APIProvider } from "@vis.gl/react-google-maps"
import { debounce } from '../services/util.service'
import { svgControls } from "./Svgs"
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

function WhereAutocompleteContent({ destinations, className = "", isOpen, onOpenChange, onDestinationSelect, handleSearch }) {
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const initialDestination = filterBy?.destination || ""

    const [whereQuery, setQuery] = useState(initialDestination)
    const [suggestions, setSuggestions] = useState(destinations)
    const [googleSuggestions, setGoogleSuggestions] = useState([])
    const [isGoogleReady, setIsGoogleReady] = useState(false)

    const containerRef = useRef(null)
    const inputRef = useRef(null)
    const autocompleteServiceRef = useRef(null)

    const debouncedSelectRef = useRef(
        debounce((destination) => {
            onDestinationSelect?.(destination)
        }, 500)
    )

    // Initialize Google Places API when it loads
    useEffect(() => {
        const checkGoogle = () => {
            if (window.google?.maps?.places && !isGoogleReady) {
                autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
                setIsGoogleReady(true)
                // console.log('Google Places API initialized')
                return true
            }
            return false
        }
        
        if (checkGoogle()) return
        
        const interval = setInterval(() => {
            if (checkGoogle()) {
                clearInterval(interval)
            }
        }, 100)
        
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (initialDestination && whereQuery === "") {
            setQuery(initialDestination)
        }
    }, [])

    const handleSelect = (dest) => {
        setQuery(dest.name)
        setSuggestions([])
        setGoogleSuggestions([])
        onOpenChange(false)
        onDestinationSelect?.(dest)
    }

    const handleGoogleSelect = (prediction) => {
        const destination = {
            name: prediction.description,
            description: "",
            icon: "default-location"
        }
        setQuery(prediction.description)
        setSuggestions([])
        setGoogleSuggestions([])
        onOpenChange(false)
        onDestinationSelect?.(destination)
    }

    const handleInputChange = (ev) => {
        const inputValue = ev.target.value
        setQuery(inputValue)

        if (inputValue === "") {
            setSuggestions(destinations)
            setGoogleSuggestions([])
        } else {
            const filtered = destinations.filter((dest) =>
                dest.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            setSuggestions(filtered)

            if (isGoogleReady && autocompleteServiceRef.current) {
                // console.log('Calling Google Places API with:', inputValue)
                autocompleteServiceRef.current.getPlacePredictions(
                    { 
                        input: inputValue,
                        types: ['(cities)']
                    },
                    (predictions, status) => {
                        // console.log('Google API Response:', status, predictions)
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                            setGoogleSuggestions(predictions)
                        } else {
                            setGoogleSuggestions([])
                        }
                    }
                )
            }
        }
    }

    const handleClear = (ev) => {
        ev.stopPropagation()
        setQuery("")
        setSuggestions(destinations)
        setGoogleSuggestions([])
        onDestinationSelect?.(null)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const allSuggestions = [...suggestions, ...googleSuggestions]

    return (
        <div
            className={`search-section search-section-where ${isOpen ? "active" : ""}`}
            ref={containerRef}
            onClick={() => {
                onOpenChange(true)
                setSuggestions(destinations)
            }}
        >
            <div className="search-label">Where</div>
            <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="Search destinations"
                value={whereQuery}
                onChange={handleInputChange}
                onFocus={() => {
                    onOpenChange(true)
                    setSuggestions(destinations)
                }}
            />
            {whereQuery && (
                <button
                    className="search close-btn"
                    onClick={handleClear}
                    aria-label="Clear destination"
                >
                    {svgControls.closeModal}
                </button>
            )}

            {isOpen && (
                <div className={`where-modal-content ${className}`}>
                    {allSuggestions.length > 0 && (
                        <>
                            <SimpleBar className="suggestions-dropdown" style={{ maxHeight: '500px' }}>
                                <span className="suggestions-dropdown-header">Suggested destinations</span>
                                
                                {suggestions.map((dest, idx) => (
                                    <div
                                        key={`dest-${idx}`}
                                        className="suggestion-item"
                                        onClick={() => handleSelect(dest)}
                                    >
                                        <span className="suggestion-icon">
                                            <img src={`/img/where/${dest.icon}.png`} alt={dest.icon} className="where-dropdown-icon" />
                                        </span>
                                        <div className="suggestion-text">
                                            <span className="suggestion-name">{dest.name}</span>
                                            {dest.description && (
                                                <span className="suggestion-description">{dest.description}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {googleSuggestions.map((prediction) => (
                                    <div
                                        key={prediction.place_id}
                                        className="suggestion-item"
                                        onClick={() => handleGoogleSelect(prediction)}
                                    >
                                        <span className="suggestion-icon">
                                            <img 
                                                src={`/img/where/default-location.png`} 
                                                alt="location" 
                                                className="where-dropdown-icon"
                                                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                                            />
                                        </span>
                                        <div className="suggestion-text">
                                            <span className="suggestion-name">{prediction.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </SimpleBar>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export function WhereAutocomplete(props) {
    return (
        <APIProvider 
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
        >
            <WhereAutocompleteContent {...props} />
        </APIProvider>
    )
}