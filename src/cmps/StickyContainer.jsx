import { useEffect, useRef, useState } from "react"
import { DateSelector, StickyDateSelector } from "./DateSelector"
import { DateRangePicker } from "./DateRangePicker"
import { useClickOutside } from "../customHooks/useClickOutside"
import { CalendarStayDates, FancyButton, RareFind, TotalCount } from "./SmallComponents"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { GuestSelector } from "./GuestSelector"
import { calculateNights, formatDate, formatGuestsText, toUrlDate } from "../services/util.service"
import { Modal } from "./Modal"
import { svgControls } from "./Svgs"
import { setCurrentOrder } from "../store/actions/order.actions"
import { useIsBreakPoint } from "../customHooks/useIsBreakPoint"
import { useSelector } from "react-redux"

export function StickyContainer({ stay, dateRange, setDateRange, guests, setGuests, handleOnClear }) {

    const [modalType, setModalType] = useState(null)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)


    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const { stayId } = useParams()
    const startDate = dateRange.from
    const endDate = dateRange.to

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

    useClickOutside([containerRef, modalRef], () => {
        setModalType(null)
    })

    function handleClick() {
        const from = dateRange.from
        const to = dateRange.to

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
    const isSmall = useIsBreakPoint(800)
    const isMed = useIsBreakPoint(880)
    const isBig = useIsBreakPoint(960)

    const hasGuestValues = guests?.adults > 0 || guests?.children > 0 || guests?.infants > 0 || guests?.pets > 0


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
                    className={`${modalType === 'who' ? 'guests' : 'calendar'} 
                    ${isSmall ? 'small' : ''}
                    ${isMed ? 'med' : ''}
                    ${isBig ? 'big' : ''}
                    
                    
                    `}
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

