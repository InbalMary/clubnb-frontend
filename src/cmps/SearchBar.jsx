import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appHeaderSvg } from "./Svgs";
import { WhereAutocomplete } from "./WhereAutocomplete";
import { DateSelector } from "./DateSelector";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "../customHooks/useDateRange";
import { GuestSelector } from "./GuestSelector";
import { formatDate } from '../services/util.service'

export function SearchBar({ initialModal = null }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeModal, setActiveModal] = useState(initialModal)
    const { dateRange, setDateRange } = useDateRange()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
    const [destination, setDestination] = useState(null)

    const searchBarRef = useRef(null)

    const destinations = [
        {
            icon: appHeaderSvg.nearby,
            name: 'Nearby',
            description: "Find what's around you",
        },
        {
            icon: appHeaderSvg.tlv,
            name: 'Tel Aviv-Yafo, Israel',
            description: "Because your wishlist has stays in Tel Aviv-Yafo",
        },
        {
            icon: appHeaderSvg.bucharest,
            name: 'Bucharest, Romania',
            description: "For sights like Cismigiu Gardens"
        },
        {
            icon: appHeaderSvg.paris,
            name: 'Paris, France',
            description: "For its stunning architecture",
        },
        {
            icon: appHeaderSvg.budapest,
            name: 'Budapest, Hungary',
            description: "For its bustling nightlife",
        },
        {
            icon: appHeaderSvg.istanbul,
            name: 'Istanbul, Türkiye',
            description: "For its top-notch dining",
        },
        {
            icon: appHeaderSvg.rome,
            name: 'Rome, Italy',
            description: "For sights like Trevi Fountain",
        },
    ]

    useEffect(() => {
        if (initialModal) {
            setActiveModal(initialModal);
        }
    }, [initialModal])

    useEffect(() => {
        const destinationParam = searchParams.get('destination')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const adults = searchParams.get('adults')
        const children = searchParams.get('children')
        const infants = searchParams.get('infants')
        const pets = searchParams.get('pets')

        if (destinationParam) {
            const dest = destinations.find(d => d.name === destinationParam)
            if (dest) setDestination(dest)
        }

        if (startDate || endDate) {
            setDateRange({
                from: startDate ? new Date(startDate.replace(/\//g, '-')) : null,
                to: endDate ? new Date(endDate.replace(/\//g, '-')) : null
            })
        }

        if (adults || children || infants || pets) {
            setGuests({
                adults: parseInt(adults) || 0,
                children: parseInt(children) || 0,
                infants: parseInt(infants) || 0,
                pets: parseInt(pets) || 0
            })
        }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams()

        if (destination) {
            params.set('destination', destination.name)
        }

        if (dateRange.from) {
            params.set('startDate', formatDate(dateRange.from))
        }

        if (dateRange.to) {
            params.set('endDate', formatDate(dateRange.to))
        }

        if (guests.adults > 0) {
            params.set('adults', guests.adults.toString())
        }

        if (guests.children > 0) {
            params.set('children', guests.children.toString())
        }

        if (guests.infants > 0) {
            params.set('infants', guests.infants.toString())
        }

        if (guests.pets > 0) {
            params.set('pets', guests.pets.toString())
        }

        setSearchParams(params, { replace: true })
    }, [destination, dateRange, guests])

    useEffect(() => {
        function handleClickOutside(event) {
            const isInsideSearch = searchBarRef.current?.contains(event.target)
            const isInsideModal = event.target.closest('.modal') || event.target.closest('.modal-content')

            if (!isInsideSearch && !isInsideModal) {
                setActiveModal(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleDateComplete = (range) => {
        setDateRange(range)

        if (activeModal === 'checkin' && range.from && !range.to) {
            setActiveModal('checkout')
        }
    }

    const handleDestinationSelect = (dest) => {
        setDestination(dest)
    }

    const handleSearch = () => {
        const filters = {
            destination,
            startDate: dateRange.from ? formatDate(dateRange.from) : null,
            endDate: dateRange.to ? formatDate(dateRange.to) : null,
            guests: {
                adults: guests.adults,
                children: guests.children,
                infants: guests.infants,
                pets: guests.pets,
            }
        }
        console.log('Search filters:', filters)
        setActiveModal(null)
    }

    return (
        <div className="search-bar-wrapper" ref={searchBarRef}>
            <div className="search-item-container">
                <WhereAutocomplete
                    destinations={destinations}
                    isOpen={activeModal === 'where'}
                    onOpenChange={(open) => setActiveModal(open ? 'where' : null)}
                    onDestinationSelect={handleDestinationSelect}
                />

                <div className="search-divider"></div>

                <DateSelector
                    label="Check in"
                    date={dateRange.from}
                    isActive={activeModal === 'checkin'}
                    onClick={() => setActiveModal('checkin')}
                />

                <div className="search-divider"></div>

                <DateSelector
                    label="Check out"
                    date={dateRange.to}
                    isActive={activeModal === 'checkout'}
                    onClick={() => setActiveModal('checkout')}
                />

                <div className="search-divider"></div>

                <div
                    className={`search-section search-section-who ${activeModal === 'who' ? 'active' : ''}`}
                    onClick={() => setActiveModal("who")}
                >
                    <div className="search-content">
                        <div className="search-label">Who</div>
                        <div className="search-placeholder">Add guests</div>
                    </div>
                    <button
                        className="search-button"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            handleSearch()
                        }}
                    >
                        <span>{appHeaderSvg.search}</span>
                        <span className="search-button-text">Search</span>
                    </button>
                </div>

                {activeModal === "who" && (
                    <div className="guest-modal-content">
                        <GuestSelector
                            onGuestsChange={setGuests}
                            initialGuests={guests}
                        />
                    </div>
                )}
            </div>

            {(activeModal === "checkin" || activeModal === "checkout") && (
                <div className="modal">
                    <DateRangePicker
                        value={dateRange}
                        onComplete={handleDateComplete}
                        activeField={activeModal}
                    />
                </div>
            )}
        </div>
    )
}