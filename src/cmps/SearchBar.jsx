import { useEffect, useRef, useState } from "react";
import { appHeaderSvg } from "./Svgs";
import { WhereAutocomplete } from "./WhereAutocomplete";
import { DateSelector } from "./DateSelector";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "../customHooks/useDateRange";
import { GuestSelector } from "./GuestSelector";

export function SearchBar() {
    const [activeModal, setActiveModal] = useState(null)
    const { dateRange, setDateRange } = useDateRange()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

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

    return (
        <div className="search-bar-wrapper" ref={searchBarRef}>
            <div className="search-item-container">
                <WhereAutocomplete
                    destinations={destinations}
                    isOpen={activeModal === 'where'}
                    onOpenChange={(open) => setActiveModal(open ? 'where' : null)}
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
                    <button className="search-button">
                        <span>{appHeaderSvg.search}</span>
                        <span className="search-button-text">Search</span>
                    </button>
                </div>
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

            {activeModal === "who" && (
                <div className="guest-modal-content">
                    <GuestSelector
                        onGuestsChange={setGuests}
                        initialGuests={guests}
                    />
                </div>
            )}
        </div>
    )
}