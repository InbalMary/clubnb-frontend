import { useEffect, useRef, useState } from "react"
import { DateSelector, StickyDateSelector } from "./DateSelector"
import { reUseDateRange, useDateRange } from "../customHooks/useDateRange"
import { DateRangePicker } from "./DateRangePicker"
import { useClickOutside } from "../customHooks/useClickOutside"
import { CalendarStayDates, FancyButton } from "./SmallComponents"
import { useParams, useSearchParams } from "react-router"
import { GuestSelector } from "./GuestSelector"
import { calculateNights, debounce, formatDate, formatGuestsText } from "../services/util.service"
import { ReDateRangePicker } from "./ReDateRangePicker"
import diamond from "../assets/svgs/diamond.png"
import { Modal } from "./Modal"
import { svgControls } from "./Svgs"
import { loadStay } from "../store/actions/stay.actions"
import { useDateContext } from "../context/DateRangeProvider"
import { useSelector } from "react-redux"

export function StickyContainer({ stay, initialModal = null }) {
    useEffect(() => {
    }, [stay])

    const [modalType, setModalType] = useState(null)
    const [activeModal, setActiveModal] = useState(null)

    const { dateRange, setDateRange } = useDateContext()
    const [searchParams, setSearchParams] = useSearchParams()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const adults = searchParams.get('adults')
    const children = searchParams.get('children')
    const infants = searchParams.get('infants')
    const pets = searchParams.get('pets')

    useEffect(() => {
        setGuests({
            adults: parseInt(adults) || 0,
            children: parseInt(children) || 0,
            infants: parseInt(infants) || 0,
            pets: parseInt(pets) || 0,
        })
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams()
            if (dateRange.from) params.set('startDate', formatDate(dateRange.from))
            if (dateRange.to) params.set('endDate', formatDate(dateRange.to))
            if (guests.adults) params.set('adults', guests.adults.toString())
            if (guests.children) params.set('children', guests.children.toString())
            if (guests.infants) params.set('infants', guests.infants.toString())
            if (guests.pets) params.set('pets', guests.pets.toString())
            setSearchParams(params, { replace: true })
        }, 300)

        return () => clearTimeout(timeout)

    }, [dateRange, guests])

    const containerRef = useRef()
    const modalRef = useRef()


    useEffect(() => {
        if (modalType) {
            setModalType(modalType)
        }
    }, [modalType])

    const handleDateComplete = (range) => {
        setDateRange(range)

        if (modalType === 'checkin' && range.from && !range.to) {
            setModalType('checkout')
        }
    }

    useClickOutside([containerRef, modalRef], () => {
        setModalType(null)
    })

    return (
        <div ref={containerRef} className="sticky-container-wrap">

            <div className="sticky-container">
                <RareFind stay={stay} startDate={startDate} endDate={endDate} />

                {/* <h2 className="add-dates_sticky">Add dates for prices</h2> */}

                <div className="form-wrapper">

                    <span className={`date-wrapper ${(modalType === 'checkin' || modalType === 'checkout') ? 'active' : ''}`}>

                        <StickyDateSelector
                            label="CHECK-IN"
                            date={dateRange.from}
                            isActive={modalType === 'checkin'}
                            onClick={() => setModalType('checkin')}
                            onClear={() => setDateRange(prev => ({ ...prev, from: null, to: null }))}
                        />
                        <div className="divider"></div>

                        <StickyDateSelector
                            label="CHECK-OUT"
                            date={dateRange.to}
                            isActive={modalType === 'checkout'}
                            onClick={() => setModalType('checkout')}
                            onClear={() => setDateRange(prev => ({ ...prev, to: null, from: null }))}
                        />
                    </span >
                    <div className="border-bot"></div>
                    <span className="guest-wrapper">

                        <div
                            className={`search-section search-section-who ${modalType === 'who' ? 'active' : ''}`}
                            onClick={() => setModalType("who")}
                        >
                            <div className="search-content">
                                <div className="search-label">Who</div>
                                <div className="search-placeholder">{formatGuestsText(guests)}</div>
                            </div>
                        </div>
                    </span>
                </div>

                <Modal
                    header=" "
                    isOpen={modalType !== null}
                    onClose={() => setModalType(null)}
                    closePosition="none"
                    className={`${modalType === 'who' ? 'guests' : 'calendar'}`}
                    useBackdrop={false}>

                    {(modalType === "checkin" || modalType === "checkout") &&
                        <>
                            < CalendarStayDates startDate={startDate} endDate={endDate} />
                            <DateRangePicker
                                value={dateRange}
                                onComplete={handleDateComplete}
                                activeField={modalType}
                            />
                        </>
                    }
                </Modal>
                {modalType === "who" && (
                    <div className="guest-modal-content">
                        <GuestSelector
                            onGuestsChange={setGuests}
                            initialGuests={guests}
                        />
                    </div>
                )}

                <FancyButton>
                    {(startDate && endDate) ? 'Reserve' : 'Check availability'}
                </FancyButton>

                {startDate && endDate && <span className="not-charged flex">You won't be charged yet</span>}

                {startDate && endDate && <TotalCount stay={stay} startDate={startDate} endDate={endDate} />
                }
            </div>
        </div>
    )
}

function RareFind({ stay, startDate, endDate }) {
    const [showRareFind, setShowRareFind] = useState(false);

    const debouncedShowRef = useRef(
        debounce(() => {
            setShowRareFind(true)
        }, 200)
    )

    useEffect(() => {
        if (startDate && endDate) {
            debouncedShowRef.current()
        } else {
            setShowRareFind(false)
            debouncedShowRef.current.cancel()
        }
        return () => {
            setShowRareFind(false)
            debouncedShowRef.current.cancel()
        }
    }, [startDate, endDate])

    return (
        <div>
            {showRareFind ? (
                <>
                    <h3 className="rare-find_sticky">{<img src={diamond} style={{ width: '30px' }} />} Rare find! This place is usually booked</h3>
                    <span className="cash-per-night">
                        <h2 className="cash_sticky">{`$ ${stay.price}`}</h2><span>night</span>
                    </span>
                </>

            ) : (

                <h2 className="add-dates_sticky">Add dates for prices</h2>
            )}
        </div>
    )
}

function TotalCount(stay, startDate, endDate) {

    const numNights = calculateNights(startDate, endDate)
    const totalPrice = stay.price * numNights

    // const cleaningFee = Number(stay.cleaningFee ?? 0);
    // const basePrice = Number(totalPrice ?? 0);
    // const finalTotal = cleaningFee + basePrice;

    return (
        <div className="payment-summary">

            <div className="total price-calc">
                <span className="link"> ${stay.price} X {numNights} {numNights === 1 ? 'night' : 'nights'} </span>
                <span>
                    ${totalPrice}
                </span>
            </div>


            <div className="total clean-calc">
                <span className="link ">
                    Cleaning fee
                </span>
                <span>
                    ${stay.cleaningFee}
                </span>
            </div>
            <div className="border"></div>

            <div className="total total-calc">
                <span className="bold">
                    Total
                </span>
                <span className="bold">
                    ${(stay.cleaningFee || 0) + (totalPrice || 0)}

                </span>
            </div>
        </div>
    )
}