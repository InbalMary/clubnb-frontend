import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DayPicker } from "react-day-picker"
import { enUS } from 'date-fns/locale'
import { appHeaderSvg } from "./Svgs"
import { GuestSelector } from "./GuestSelector"
import { formatDate, formatGuestsText } from '../services/util.service'

export function SearchBarMobile({ destinations, dateRange, setDateRange, guests, setGuests, destination, setDestination, onSearch, onOpenChange, isExplorePage }) {
    const params = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(null) // 'where', 'dates', 'guests'
    const [whereQuery, setWhereQuery] = useState(destination?.name || "")
    const [suggestions, setSuggestions] = useState(destinations)

    useEffect(() => {
        onOpenChange?.(isOpen)
    }, [isOpen, onOpenChange])

    const handleOpen = () => {
        setIsOpen(true)
        setActiveSection('where')
    }

    const handleClose = () => {
        setIsOpen(false)
        setActiveSection(null)
    }

    const handleClearAll = () => {
        setDestination(null)
        setWhereQuery("")
        setDateRange({ from: null, to: null })
        setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
        setSuggestions(destinations)
    }

    const handleSearch = () => {
        handleClose()
        onSearch?.()
    }

    const handleWhereInputChange = (e) => {
        const value = e.target.value
        setWhereQuery(value)

        if (value === "") {
            setSuggestions(destinations)
            setDestination(null)
        } else {
            const filtered = destinations.filter((dest) =>
                dest.name.toLowerCase().includes(value.toLowerCase())
            )
            setSuggestions(filtered)
        }
    }

    const handleDestinationSelect = (dest) => {
        setDestination(dest)
        setWhereQuery(dest.name)
        setActiveSection(null)
    }

    const handleWhereClear = () => {
        setWhereQuery("")
        setDestination(null)
        setSuggestions(destinations)
    }

    const handleDateSelect = (range) => {
        if (!range) return

        if (!dateRange.from || (dateRange.from && dateRange.to)) {
            // First click or reselecting
            setDateRange({ from: range.from, to: null })
        } else {
            // Second click
            setDateRange({ from: dateRange.from, to: range.to || range.from })
            setActiveSection(null)
        }
    }

    const handleDatesClear = () => {
        setDateRange({ from: null, to: null })
    }

    const handleGuestsClear = () => {
        setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
    }

    const getDestinationText = () => {
        if (isExplorePage) {
            if (params.city) return params.city
            // Fallback to try to extract from pathname
            const pathParts = location.pathname.split('/')
            const cityIndex = pathParts.indexOf('city')
            if (cityIndex !== -1 && pathParts[cityIndex + 1]) {
                return decodeURIComponent(pathParts[cityIndex + 1])
            }
        }
        return destination?.name || 'Anywhere'
    }

    const getDateText = () => {
        return (dateRange.from && dateRange.to)
            ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
            : 'Any weekend'
    }

    if (!isOpen) {
        // Explore page compact view - just the search bar
        if (isExplorePage) {
            return (
                <div className="explore-search-bar-mobile">
                    <button
                        className="explore-search-display"
                        onClick={handleOpen}
                    >
                        <div className="explore-search-content">
                            <div className="explore-destination-text">Homes in {getDestinationText()}</div>
                            <div className="explore-details-text">
                                <span>{getDateText()}</span>
                                <div className="explore-separator"></div>
                                <span>{formatGuestsText(guests)}</span>
                            </div>
                        </div>
                    </button>
                </div>
            )
        }

        // Regular view
        return (
            <div className="search-bar-mobile-wrapper">
                <div className="search-bar-mobile" onClick={handleOpen}>
                    <span>{appHeaderSvg.search}</span>
                    <span>Start your search</span>
                </div>
                <span className="compact-search-icon">
                    <img
                        className="anywhere-icon"
                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240"
                        alt=""
                    />
                </span>
            </div>
        )
    }

    return (
        <div className="mobile-search-modal-overlay">
            <div className="mobile-search-modal">
                {/* Header */}
                <div className="mobile-modal-header">
                    <button onClick={handleClose} className="modal-close-button btn btn-round">
                        <img src="/img/close.svg" alt="close icon" className="camera-icon header-modal-action-icons" />
                    </button>
                </div>

                {/* Content */}
                <div className="mobile-modal-content">
                    {/* Where Section */}
                    <div className="mobile-search-section">
                        <h3>Where?</h3>
                        <div
                            className={`mobile-input-box ${activeSection === 'where' ? 'active' : ''}`}
                            onClick={() => setActiveSection('where')}
                        >
                            <div className="mobile-input-wrapper">
                                <span className="mobile-input-icon">{appHeaderSvg.search}</span>
                                <input
                                    type="text"
                                    placeholder="Search destinations"
                                    value={whereQuery}
                                    onChange={handleWhereInputChange}
                                    className="mobile-input"
                                />
                                {whereQuery && (
                                    <button
                                        className="modal-close-button btn btn-round"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleWhereClear()
                                        }}
                                    >
                                        <img src="/img/close.svg" alt="close icon" className="camera-icon header-modal-action-icons" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {activeSection === 'where' && suggestions.length > 0 && (
                            <div className="mobile-suggestions">
                                <div className="mobile-suggestions-header">Suggested destinations</div>
                                {suggestions.map((dest, idx) => (
                                    <div
                                        key={idx}
                                        className="mobile-suggestion-item"
                                        onClick={() => handleDestinationSelect(dest)}
                                    >
                                        <div className="mobile-suggestion-icon">
                                            <img src={`/img/where/${dest.icon}.png`} alt={dest.icon} />
                                        </div>
                                        <div className="mobile-suggestion-text">
                                            <div className="mobile-suggestion-name">{dest.name}</div>
                                            <div className="mobile-suggestion-desc">{dest.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* When Section */}
                    <div className="mobile-search-section">
                        <h3>When</h3>
                        <div
                            className={`mobile-date-trigger ${activeSection === 'dates' ? 'active' : ''}`}
                            onClick={() => setActiveSection(activeSection === 'dates' ? null : 'dates')}
                        >
                            <div className="mobile-date-trigger-content">
                                {dateRange.from || dateRange.to ? (
                                    <span>
                                        {dateRange.from ? formatDate(dateRange.from) : 'Add date'} - {dateRange.to ? formatDate(dateRange.to) : 'Add date'}
                                    </span>
                                ) : (
                                    <span className="mobile-date-placeholder">Add dates</span>
                                )}
                            </div>
                            {(dateRange.from || dateRange.to) && (
                                <button
                                    className="modal-close-button btn btn-round"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDatesClear()
                                    }}
                                >
                                    <img src="/img/close.svg" alt="close icon" className="camera-icon header-modal-action-icons" />
                                </button>
                            )}
                        </div>

                        {activeSection === 'dates' && (
                            <div className="mobile-date-picker">
                                <DayPicker
                                    mode="range"
                                    selected={dateRange.from && dateRange.to ? dateRange : undefined}
                                    onSelect={handleDateSelect}
                                    numberOfMonths={2}
                                    disabled={{ before: new Date() }}
                                    locale={enUS}
                                    modifiers={{
                                        start: dateRange.from,
                                        end: dateRange.to,
                                    }}
                                    modifiersClassNames={{
                                        start: 'rdp-day_start',
                                        end: 'rdp-day_end',
                                    }}
                                    formatters={{
                                        formatWeekdayName: (day) =>
                                            day.toLocaleDateString("en-US", { weekday: "narrow" })
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Who Section */}
                    <div className="mobile-search-section">
                        <h3>Who</h3>
                        <div
                            className={`mobile-guest-trigger ${activeSection === 'guests' ? 'active' : ''}`}
                            onClick={() => setActiveSection(activeSection === 'guests' ? null : 'guests')}
                        >
                            <span>{formatGuestsText(guests)}</span>
                            {(guests.adults > 0 ||
                                guests.children > 0 ||
                                guests.infants > 0 ||
                                guests.pets > 0) && (
                                    <button
                                        className="modal-close-button btn btn-round"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleGuestsClear()
                                        }}
                                    >
                                        <img src="/img/close.svg" alt="close icon" className="camera-icon header-modal-action-icons" />
                                    </button>
                                )}
                        </div>

                        {activeSection === 'guests' && (
                            <div className="mobile-guest-selector">
                                <GuestSelector
                                    onGuestsChange={setGuests}
                                    initialGuests={guests}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mobile-modal-footer">
                    <button onClick={handleClearAll} className="mobile-clear-btn btn-link">
                        Clear all
                    </button>
                    <button onClick={handleSearch} className="mobile-search-btn btn btn-pink get-started-button">
                        <span>{appHeaderSvg.search}</span>
                        <span>Search</span>
                    </button>
                </div>
            </div>
        </div>
    )
}