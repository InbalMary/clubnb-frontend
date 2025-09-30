import { useState } from "react";
import { appHeaderSvg } from "./Svgs";
import { WhereAutocomplete } from "./WhereAutocomplete";
import { DateSelector } from "./DateSelector";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "../customHooks/useDateRange";

export function SearchBar() {
    const [activeModal, setActiveModal] = useState(null)
    const { dateRange, setDateRange } = useDateRange()

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

    function handleDatePickerComplete(range) {
        setDateRange(range)
        setActiveModal(null)
    }

    return (
        <div className="search-bar-wrapper">
            <div className="search-item-container">
                <WhereAutocomplete destinations={destinations} />

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
                <DateRangePicker
                    value={dateRange}
                    onComplete={(range) => {
                        setDateRange(range)
                        if (range.from && range.to) setActiveModal(null)
                    }}
                />
            )}

            {activeModal === "who" && (
                <div className="modal-content">
                    <p className="modal-text">Guest selector will go here</p>
                </div>
            )}
        </div>
    )
}