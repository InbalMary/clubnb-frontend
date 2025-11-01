import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { appHeaderSvg, svgControls } from "./Svgs";
import { WhereAutocomplete } from "./WhereAutocomplete";
import { DateSelector } from "./DateSelector";
import { DateRangePicker } from "./DateRangePicker";
import { SearchBarMobile } from "./SearchBarMobile";
import { useDateRange } from "../customHooks/useDateRange";
import { GuestSelector } from "./GuestSelector";
import { formatDate, formatGuestsText } from '../services/util.service'
import { useSelector } from "react-redux";
import { setFilterBy, loadStays } from '../store/actions/stay.actions.js'
import { useClickOutside } from "../customHooks/useClickOutside.js";

export function SearchBar({ initialModal = null, onCollapse, onMobileSearchOpenChange }) {
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [activeModal, setActiveModal] = useState(initialModal)
    const { dateRange, setDateRange } = useDateRange()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const searchBarRef = useRef(null)
    const whereModalRef = useRef(null)
    const dateModalRef = useRef(null)
    const guestModalRef = useRef(null)
    const guestSelectorRef = useRef(null)

    useClickOutside([searchBarRef, whereModalRef, dateModalRef, guestModalRef], () => {
        if (activeModal) setActiveModal(null)
    })

    const destinations = [
        {
            icon: 'nearby',
            name: 'Nearby',
            description: "Find what's around you",
        },
        {
            icon: 'tlv',
            name: 'Tel Aviv-Yafo, Israel',
            description: "Because your wishlist has stays in Tel Aviv-Yafo",
        },
        {
            icon: 'bucharest',
            name: 'Bucharest, Romania',
            description: "For sights like Cismigiu Gardens"
        },
        {
            icon: 'paris',
            name: 'Paris, France',
            description: "For its stunning architecture",
        },
        {
            icon: 'budapest',
            name: 'Budapest, Hungary',
            description: "For its bustling nightlife",
        },
        {
            icon: 'new_york',
            name: 'New York, NY, USA',
            description: "For its iconic skyline and endless energy",
        },
        {
            icon: 'rome',
            name: 'Rome, Italy',
            description: "For sights like Trevi Fountain",
        },
        {
            icon: 'london',
            name: 'London, United kingdome',
            description: "For its stinning architecture",
        },
        {
            icon: 'barcelona',
            name: 'Barcelona, Spain',
            description: "Popular beach destination",
        },
        {
            icon: 'tokyo',
            name: 'Tokyo, Japan',
            description: "Fot its futuristic vibes and ancient charm",
        },
        {
            icon: 'denpasar',
            name: 'Denpasar, Denpasar City, Bali, Indonesia',
            description: "Fot its tropical beaches and Balinese charm",
        },
    ]

    const getInitialDestination = () => {
        const destinationParam = searchParams.get('destination')
        if (destinationParam) {
            return destinations.find(d => d.name === destinationParam) || { name: destinationParam }
        }
        if (filterBy.destination) {
            return destinations.find(d => d.name === filterBy.destination) || { name: filterBy.destination }
        }
        return null
    }

    const [destination, setDestination] = useState(getInitialDestination)

    useEffect(() => {
        if (initialModal) {
            setActiveModal(initialModal)
        }
    }, [initialModal])

    useEffect(() => {
        const startDate = searchParams.get('startDate') || filterBy.startDate
        const endDate = searchParams.get('endDate') || filterBy.endDate
        const adults = searchParams.get('adults') || filterBy.guests?.adults
        const children = searchParams.get('children') || filterBy.guests?.children
        const infants = searchParams.get('infants') || filterBy.guests?.infants
        const pets = searchParams.get('pets') || filterBy.guests?.pets

        if (startDate || endDate) {
            setDateRange({
                from: startDate ? new Date(startDate.replace(/\//g, '-')) : null,
                to: endDate ? new Date(endDate.replace(/\//g, '-')) : null,
            })
        }

        setGuests({
            adults: parseInt(adults) || 0,
            children: parseInt(children) || 0,
            infants: parseInt(infants) || 0,
            pets: parseInt(pets) || 0,
        })
    }, [])

    useEffect(() => {
        const isInitialRender = !searchParams.toString() &&
            !destination &&
            !dateRange.from &&
            !dateRange.to &&
            guests.adults === 0 &&
            guests.children === 0

        if (isInitialRender) return

        const params = new URLSearchParams()
        if (destination?.name) params.set('destination', destination.name)
        if (dateRange.from) params.set('startDate', formatDate(dateRange.from))
        if (dateRange.to) params.set('endDate', formatDate(dateRange.to))
        if (guests.adults) params.set('adults', guests.adults.toString())
        if (guests.children) params.set('children', guests.children.toString())
        if (guests.infants) params.set('infants', guests.infants.toString())
        if (guests.pets) params.set('pets', guests.pets.toString())

        if (!window.location.pathname.includes('/explore/city')) {
            setSearchParams(params, { replace: true })
        }
    }, [destination, dateRange, guests])

    const handleDateComplete = (range) => {
        setDateRange(range)

        if (activeModal === 'checkin' && range.from && !range.to) {
            setTimeout(() => setActiveModal('checkout'), 0)
        } else if (activeModal === 'checkout' && range.to) {
            setTimeout(() => setActiveModal('who'), 0)
        }
    }

    const handleDestinationSelect = (dest) => {
        setDestination(dest)
        setTimeout(() => setActiveModal('checkin'), 0)
    }

    const handleSearch = () => {
        setActiveModal(null)

        const totalGuests = guests.adults + guests.children

        const filterParams = {
            destination: destination?.name || null,
            startDate: dateRange.from ? formatDate(dateRange.from) : null,
            endDate: dateRange.to ? formatDate(dateRange.to) : null,
            guests: totalGuests > 0 ? totalGuests : null,
        }

        setFilterBy(filterParams)

        if (destination?.name) {
            const cityName = destination.name.split(',')[0].trim()
            const encodedCity = encodeURIComponent(cityName)

            const params = new URLSearchParams()
            if (dateRange.from) params.set('startDate', formatDate(dateRange.from))
            if (dateRange.to) params.set('endDate', formatDate(dateRange.to))
            if (guests.adults) params.set('adults', guests.adults.toString())
            if (guests.children) params.set('children', guests.children.toString())
            if (guests.infants) params.set('infants', guests.infants.toString())
            if (guests.pets) params.set('pets', guests.pets.toString())

            const queryString = params.toString()
            navigate(`/explore/city/${encodedCity}${queryString ? `?${queryString}` : ''}`)
            if (onCollapse) onCollapse()
        } else if (window.location.pathname.includes('/explore/city')) {
            const params = new URLSearchParams()
            if (dateRange.from) params.set('startDate', formatDate(dateRange.from))
            if (dateRange.to) params.set('endDate', formatDate(dateRange.to))
            if (guests.adults) params.set('adults', guests.adults.toString())
            if (guests.children) params.set('children', guests.children.toString())
            if (guests.infants) params.set('infants', guests.infants.toString())
            if (guests.pets) params.set('pets', guests.pets.toString())
            setSearchParams(params, { replace: true })
            loadStays(filterParams)
            if (onCollapse) onCollapse()
        } else {
            loadStays(filterParams)
        }
    }

    const hasGuestValues = guests.adults > 0 || guests.children > 0 || guests.infants > 0 || guests.pets > 0

    return (
        <div className="search-bar-container">
            {/* Mobile Search Bar */}
            <SearchBarMobile
                destinations={destinations}
                dateRange={dateRange}
                setDateRange={setDateRange}
                guests={guests}
                setGuests={setGuests}
                destination={destination}
                setDestination={setDestination}
                onSearch={handleSearch}
                onOpenChange={onMobileSearchOpenChange}
            />

            {/* Desktop Search Bar */}
            <div className="search-bar-wrapper" ref={searchBarRef}>
                <div className="search-item-container">
                    <WhereAutocomplete
                        ref={whereModalRef}
                        destinations={destinations}
                        isOpen={activeModal === 'where'}
                        onOpenChange={(open) => setActiveModal(open ? 'where' : null)}
                        onDestinationSelect={handleDestinationSelect}
                    />

                    <div className="search-divider"></div>

                    <DateSelector
                        label="Check in"
                        isHeader={true}
                        date={dateRange.from}
                        isActive={activeModal === 'checkin'}
                        onClick={() => setActiveModal('checkin')}
                        onClear={() => setDateRange(prev => ({ ...prev, to: null, from: null }))}
                    />

                    <div className="search-divider"></div>

                    <DateSelector
                        label="Check out"
                        isHeader={true}
                        date={dateRange.to}
                        isActive={activeModal === 'checkout'}
                        onClick={() => setActiveModal('checkout')}
                        onClear={() => setDateRange(prev => ({ ...prev, to: null, from: null }))}
                    />

                    <div className="search-divider"></div>

                    <div
                        className={`search-section search-section-who ${activeModal === 'who' ? 'active' : ''}`}
                        onClick={() => setActiveModal("who")}
                    >
                        <div className="search-content">
                            <div className="search-label">Who</div>
                            <div className={`search-placeholder ${hasGuestValues ? 'has-value' : ''}`}
                            >{formatGuestsText(guests)}</div>
                            {hasGuestValues && (
                                <button
                                    className="search close-btn"
                                    onClick={(ev) => {
                                        ev.stopPropagation()
                                        setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })
                                    }}
                                    aria-label="Clear guests"
                                >
                                    {svgControls.closeModal}
                                </button>
                            )}
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
                        <div className="guest-modal-content" ref={guestModalRef}>
                            <GuestSelector
                                ref={guestSelectorRef}
                                onGuestsChange={setGuests}
                                initialGuests={guests}
                            />
                        </div>
                    )}
                </div>

                {(activeModal === "checkin" || activeModal === "checkout") && (
                    <div className="modal" ref={dateModalRef}>
                        <DateRangePicker
                            value={dateRange}
                            onComplete={handleDateComplete}
                            activeField={activeModal}
                        />
                    </div>
                )}
            </div>

        </div>
    )
}