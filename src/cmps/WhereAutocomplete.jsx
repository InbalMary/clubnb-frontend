import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { debounce } from '../services/util.service'
import { svgControls } from "./Svgs"
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export function WhereAutocomplete({ destinations, className = "", isOpen, onOpenChange, onDestinationSelect, handleSearch }) {
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const initialDestination = filterBy?.destination || ""

    const [whereQuery, setQuery] = useState(initialDestination)
    const [suggestions, setSuggestions] = useState(destinations)

    const containerRef = useRef(null)
    const inputRef = useRef(null)

    const debouncedSelectRef = useRef(
        debounce((destination) => {
            onDestinationSelect?.(destination)
        }, 500)
    )

    useEffect(() => {
        if (initialDestination && whereQuery === "") {
            setQuery(initialDestination)
        }
    }, [])

    const handleSelect = (dest) => {
        setQuery(dest.name)
        setSuggestions([])
        onOpenChange(false)
        onDestinationSelect?.(dest)
    }

    const handleInputChange = (ev) => {
        const inputValue = ev.target.value
        setQuery(inputValue)

        debouncedSelectRef.current({ name: inputValue })

        if (inputValue === "") {
            setSuggestions(destinations)
        } else {
            const filtered = destinations.filter((dest) =>
                dest.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            setSuggestions(filtered)
        }
    }

    const handleClear = (ev) => {
        ev.stopPropagation()
        setQuery("")
        setSuggestions(destinations)
        onDestinationSelect?.(null)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

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
                    {suggestions.length > 0 && (
                        <>
                            <SimpleBar className="suggestions-dropdown" style={{ maxHeight: '500px' }}>
                                <span className="suggestions-dropdown-header">Suggested destinations</span>
                                {suggestions.map((dest, idx) => (
                                    <div
                                        key={idx}
                                        className="suggestion-item"
                                        onClick={() => handleSelect(dest)}
                                    >
                                        <span className="suggestion-icon">
                                            <img src={`/img/where/${dest.icon}.png`} alt={dest.icon} className="where-dropdown-icon" />
                                        </span>
                                        <div className="suggestion-text">
                                            <span className="suggestion-name">{dest.name}</span>
                                            <span className="suggestion-description">{dest.description}</span>
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