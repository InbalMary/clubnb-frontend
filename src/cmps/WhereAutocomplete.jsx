import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { debounce } from '../services/util.service'

export function WhereAutocomplete({ destinations, className = "", isOpen, onOpenChange, onDestinationSelect }) {
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const initialDestination = filterBy?.destination || ""

    const [whereQuery, setQuery] = useState(initialDestination)
    const [suggestions, setSuggestions] = useState(destinations)

    const containerRef = useRef(null)

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

    const handleBlur = () => {
        if (whereQuery && whereQuery.trim() !== "") {
            onDestinationSelect?.({ name: whereQuery })
        }
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
                className="search-input"
                type="text"
                placeholder="Search destinations"
                value={whereQuery}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={() => {
                    onOpenChange(true)
                    setSuggestions(destinations)
                }}
            />

            {isOpen && (
                <div className={`where-modal-content ${className}`}>
                    {suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            <span className="suggestions-dropdown-header">Suggested destinations</span>
                            {suggestions.map((dest, idx) => (
                                <div
                                    key={idx}
                                    className="suggestion-item"
                                    onClick={() => handleSelect(dest)}
                                >
                                    <span className="suggestion-icon">{dest.icon}</span>
                                    <div className="suggestion-text">
                                        <span className="suggestion-name">{dest.name}</span>
                                        <span className="suggestion-description">{dest.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}