import { useEffect, useRef, useState } from "react"
import { DateSelector, StickyDateSelector } from "./DateSelector"
import { DateRangePicker } from "./DateRangePicker"
import { useClickOutside } from "../customHooks/useClickOutside"
import { CalendarStayDates, FancyButton, RareFind } from "./SmallComponents"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { GuestSelector } from "./GuestSelector"
import { calculateNights, formatDate, formatGuestsText } from "../services/util.service"
import { Modal } from "./Modal"
import { svgControls } from "./Svgs"
import { setCurrentOrder } from "../store/actions/order.actions"

export function StickyContainer({ stay, dateRange, setDateRange }) {

    const [modalType, setModalType] = useState(null)
    const [userCleared, setUserCleared] = useState(false)


    const [searchParams, setSearchParams] = useSearchParams()
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
    const navigate = useNavigate()
    const { stayId } = useParams()

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const adults = searchParams.get('adults')
    const children = searchParams.get('children')
    const infants = searchParams.get('infants')
    const pets = searchParams.get('pets')

    useEffect(() => {
        if (userCleared) return
        const clearedFlag = stayId && sessionStorage.getItem(`datesClearedForStay_${stayId}`)
        if (clearedFlag) return

        const hasStartDate = !!startDate
        const hasEndDate = !!endDate

        if (!hasStartDate && !hasEndDate && stay?.startDate && stay?.endDate) {
            const from = new Date(stay.startDate)
            const to = new Date(stay.endDate)
            setDateRange({ from, to })
        }

        setGuests({
            adults: parseInt(adults) || 0,
            children: parseInt(children) || 0,
            infants: parseInt(infants) || 0,
            pets: parseInt(pets) || 0,
        })
    }, [stay, userCleared])


    useEffect(() => {

        if (startDate && endDate) {
            setDateRange({ from: new Date(startDate), to: new Date(endDate) })
        }
    }, [startDate, endDate])


    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            let changed = false

            if (dateRange.from && startDate !== formatDate(dateRange.from)) {
                params.set('startDate', formatDate(dateRange.from))
                changed = true
            } else if (!dateRange.from && userCleared && params.has('startDate')) {
                params.delete('startDate')
                changed = true
            }

            if (dateRange.to && endDate !== formatDate(dateRange.to)) {
                params.set('endDate', formatDate(dateRange.to))
                changed = true
            } else if (!dateRange.to && userCleared && params.has('endDate')) {
                params.delete('endDate')
                changed = true
            }

            if (guests.adults) params.set('adults', guests.adults.toString())
            if (guests.children) params.set('children', guests.children.toString())
            if (guests.infants) params.set('infants', guests.infants.toString())
            if (guests.pets) params.set('pets', guests.pets.toString())

            if (changed) setSearchParams(params, { replace: true })
        }, 300)

        return () => clearTimeout(timeout)

    }, [dateRange, guests, userCleared])

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
        } else if (modalType === 'checkout' && range.from && range.to) {
            setTimeout(() =>
                setModalType(null)
                , 400)
        }
    }

    function handleOnClear() {
        setUserCleared(true)
        setDateRange({ from: null, to: null })

        const params = new URLSearchParams(searchParams)
        params.delete('startDate')
        params.delete('endDate')
        setSearchParams(params, { replace: true })
        if (stayId) sessionStorage.setItem(`datesClearedForStay_${stayId}`, 'true')
    }

    useClickOutside([containerRef, modalRef], () => {
        setModalType(null)
    })

    function handleClick() {
        const from = dateRange.from || startDate
        const to = dateRange.to || endDate

        if (from && to) {
            const numNights = calculateNights(from, to)
            const pricePerNight = stay.price
            const cleaningFee = stay.cleaningFee || 0
            const serviceFee = Math.round(pricePerNight * 0.1)

            const order = {
                stay,
                host: stay.host,
                startDate: from,
                endDate: to,
                guests,
                numNights,
                pricePerNight,
                cleaningFee,
                serviceFee,
                totalPrice: numNights * pricePerNight
            }
            setCurrentOrder(order)
            navigate(`/stay/${stay._id}/confirm-pay`, { state: { order } })
        } else {
            setModalType('checkin')
        }
    }

    const hasGuestValues = guests.adults > 0 || guests.children > 0 || guests.infants > 0 || guests.pets > 0

    return (
        <div ref={containerRef} className="sticky-container-wrap">

            <div className="sticky-container">
                <RareFind showRareMsg={true} showPriceInfo={true} stay={stay} startDate={startDate} endDate={endDate} />

                <div className="form-wrapper">

                    <span className={`date-wrapper ${(modalType === 'checkin' || modalType === 'checkout') ? 'active' : ''}`}>

                        <DateSelector
                            label="CHECK-IN"
                            isHeader={false}
                            date={dateRange.from}
                            isActive={modalType === 'checkin'}
                            placeholder={(modalType === 'checkin') ? 'MM/DD/YYYY' : 'Add dates'}
                            onClick={() => setModalType('checkin')}
                            onClear={handleOnClear}
                        />
                        <div className="divider"></div>

                        <DateSelector
                            label="CHECKOUT"
                            isHeader={false}
                            date={dateRange.to}
                            placeholder={(modalType === 'checkout') ? 'MM/DD/YYYY' : 'Add dates'}
                            isActive={modalType === 'checkout'}
                            onClick={() => setModalType('checkout')}
                            onClear={handleOnClear} />
                    </span >
                    <div className="border-bot"></div>
                    <span className="guest-wrapper">
                        <div
                            className={`search-section search-section-who ${modalType === 'who' ? 'active' : ''}`}
                            onClick={() => setModalType(modalType === 'who' ? null : 'who')}
                        >
                            <div className="search-content">
                                <div className="search-label">GUESTS</div>
                                <div className={`search-placeholder ${hasGuestValues ? 'has-value' : ''}`}>{formatGuestsText(guests)}</div>
                            </div>
                            <span className="who-controls">{(modalType === 'who') ? svgControls.chevronUp : svgControls.chevronDown}</span>
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
                            <DateRangePicker value={dateRange} onComplete={handleDateComplete} activeField={modalType} />
                        </>
                    }
                    {modalType === "who" && (
                        <GuestSelector onGuestsChange={setGuests} initialGuests={guests} />
                    )}

                </Modal>

                <FancyButton onClick={handleClick}>
                    {(startDate && endDate) ? 'Reserve' : 'Check availability'}
                </FancyButton>

                {startDate && endDate && <span className="not-charged flex">You won't be charged yet</span>}

                {startDate && endDate &&
                    <TotalCount stay={stay} startDate={startDate} endDate={endDate} />
                }
            </div>
        </div>
    )
}



function TotalCount({ stay, startDate, endDate }) {
    const price = stay.price
    const numNights = calculateNights(startDate, endDate)
    const totalPrice = price * numNights

    return (
        <div className="payment-summary">

            <div className="total price-calc">
                <span className="link"> {`$ ${stay.price}`} X {numNights} {numNights === 1 ? 'night' : 'nights'} </span>
                <span>
                    ${totalPrice}
                </span>
            </div>


            {stay?.cleaningFee &&
                <div className="total clean-calc">
                    <span className="link ">
                        Cleaning fee
                    </span>
                    <span>
                        ${stay.cleaningFee}
                    </span>
                </div>
            }
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