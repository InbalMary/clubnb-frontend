import { useEffect, useRef, useState } from "react";

export function WhereAutocomplete({ destinations, className = "", isOpen, onOpenChange, onDestinationSelect }) {
    const [whereQuery, setQuery] = useState("")
    const [suggestions, setSuggestions] = useState(destinations)

    const containerRef = useRef(null)

    const handleSelect = (dest) => {
        setQuery(dest.name)
        setSuggestions([])
        onOpenChange(false)
        onDestinationSelect?.(dest)
    }

    const handleInputChange = (ev) => {
        const inputValue = ev.target.value
        setQuery(inputValue)

        if (inputValue === "") {
            setSuggestions(destinations)
        } else {
            const filtered = destinations.filter((dest) =>
                dest.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            setSuggestions(filtered)
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