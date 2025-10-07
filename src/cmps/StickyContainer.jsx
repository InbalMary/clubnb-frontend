import { useEffect, useRef, useState } from "react";
import { DateSelector } from "./DateSelector";
import { useDateRange } from "../customHooks/useDateRange";
import { DateRangePicker } from "./DateRangePicker";
import { useClickOutside } from "../customHooks/useClickOutside";
import { CalendarStayDates } from "./SmallComponents";
import { useSearchParams } from "react-router";
import { GuestSelector } from "./GuestSelector";
import { formatGuestsText } from "../services/util.service";
import { ReDateRangePicker } from "./ReDateRangePicker";


export function StickyContainer(initialModal = null) {

    const [activeModal, setActiveModal] = useState(initialModal)
    const { dateRange, setDateRange } = useDateRange()
    const [searchParams, setSearchParams] = useSearchParams()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const adults = searchParams.get('adults')
    const children = searchParams.get('children')
    const infants = searchParams.get('infants')
    const pets = searchParams.get('pets')
    useEffect(() => {

        const params = new URLSearchParams()

        if (guests.adults) params.set('adults', guests.adults.toString())
        if (guests.children) params.set('children', guests.children.toString())
        if (guests.infants) params.set('infants', guests.infants.toString())
        if (guests.pets) params.set('pets', guests.pets.toString())
        setSearchParams(params, { replace: true })

        setGuests({
            adults: parseInt(adults) || 0,
            children: parseInt(children) || 0,
            infants: parseInt(infants) || 0,
            pets: parseInt(pets) || 0,
        })
    }, [])

    const containerRef = useRef()
    const modalRef = useRef()

    useEffect(() => {
        if (initialModal) {
            setActiveModal(initialModal);
        }
    }, [initialModal, startDate, endDate])

    const handleDateComplete = (range) => {
        setDateRange(range)

        if (activeModal === 'checkin' && range.from && !range.to) {
            setActiveModal('checkout')
        }
        if (activeField === 'checkin') {
            onComplete?.({ from: range.from, to: value.to ?? null })
        } else if (activeField === 'checkout') {
            onComplete?.({ from: value.from, to: range.to ?? range.from })
        }
    }

    useClickOutside([containerRef, modalRef], () => {
        setActiveModal(null)
    })

    return (
        <div ref={containerRef} className="sticky-container">
            <span className="date-wrapper">
                <DateSelector
                    label="CHECK-IN"
                    date={dateRange.from}
                    isActive={activeModal === 'checkin'}
                    onClick={() => setActiveModal('checkin')}
                />
                <div className="divider"></div>
                <DateSelector
                    label="CHECK-OUT"
                    date={dateRange.to}
                    isActive={activeModal === 'checkout'}
                    onClick={() => setActiveModal('checkout')}
                />
            </span >
            <span className="guest-wrapper">

                <div
                    className={`search-section search-section-who ${activeModal === 'who' ? 'active' : ''}`}
                    onClick={() => setActiveModal("who")}
                >
                    <div className="search-content">
                        <div className="search-label">Who</div>
                        <div className="search-placeholder">{formatGuestsText(guests)}</div>
                    </div>
                </div>
            </span>

            {activeModal === "checkin" || activeModal === "checkout" && (
                <div ref={modalRef} className="modal">
                    <CalendarStayDates startDate={startDate} endDate={endDate} />
                    <DateRangePicker
                        value={dateRange}
                        onComplete={handleDateComplete}
                        activeField={activeModal}
                    />
                    {/* <ReDateRangePicker
                        value={dateRange}
                        // showDates={true}
                        onComplete={handleDateComplete}
                        activeField={activeModal} /> */}
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

            <button className="pink">Check availability</button>
        </div>
    )
}