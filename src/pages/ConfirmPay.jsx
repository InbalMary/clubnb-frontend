import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { stayService } from '../services/stay/stay.service.local.js'
import { svgControls, appHeaderSvg, paymentSvgs } from '../cmps/Svgs'
import { demoOrders } from '../data/demo-orders'
import { PaymentMethod } from '../cmps/PaymentMethod'
import { ReservationSummary } from '../cmps/ReservationSummary'
import { FancyButton } from '../cmps/SmallComponents'
import { addOrder } from '../store/actions/order.actions'

export function ConfirmPay() { //later send order as a prop from a parent
    const [currentStage, setCurrentStage] = useState(1)
    const [selectedPaymentTiming, setselectedPaymentTiming] = useState('full')
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [stay, setStay] = useState(null)
    const navigate = useNavigate()
    const { stayId } = useParams()
    // console.log('Confirming stay:', stayId)

    const order = demoOrders[0]
    const demoStay = order.stay
    //stay coming from service, order from demo-order
    // TODO: build order summary dynamically from stay instead of demoOrders
    const totalFees = order.cleaningFee + order.serviceFee
    const totalPrice = order.totalPrice
    const payNow = +(totalPrice * 0.2).toFixed(2)
    const payLater = +(totalPrice - payNow).toFixed(2)
    const host = order.host

    useEffect(() => {
        async function loadStay() {
            const fullStay = await stayService.getById(stayId)
            setStay(fullStay)
        }
        loadStay()
    }, [stayId])

    if (!stay) return <p>Loading stay...</p>

    function handleNextClick() {
        if (currentStage < 4) {
            setCurrentStage(currentStage + 1)
        } else {
            setCurrentStage(4)
        }
    }

    function handleBackClick() {
        navigate(-1)
    }

    async function handleReserveClick() {
        if (!stay) {
            console.error('No stay loaded, cannot reserve')
            return
        }
        const reservedOrder = {
            hostId: host._id,
            guest: {
                _id: 'test-user-1',
                fullname: 'Demo Guest'
            },
            totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            stay,
            msgs: [],
            status: 'pending'
        }
        try {
            // console.log('Reserved order before saving:', reservedOrder)
            await addOrder(reservedOrder)
            navigate('/trips')
        } catch (err) {
            console.error('Cannot reserve stay:', err)
        }

    }

    return (
        <>
            {/* Minimal header just for this page */}
            <header className="confirm-pay-logo-bar full">
                <nav className='nav-bar'>
                    <NavLink to="/" className="logo-header">
                        <span className="icon">{appHeaderSvg.logo}</span>
                        <span className="brand">clubnb</span>
                    </NavLink>
                </nav>
            </header>
            <div className="main-container">
                <section className="confirm-pay-page">
                    <button className="btn btn-gray back" onClick={handleBackClick}>{svgControls.backArrow}</button>
                    <h1 className="confirm-pay-title">Confirm and pay</h1>
                    <div className="confirm-layout">
                        {/* LEFT: main flow */}
                        <div className="confirm-main">
                            {/*TODO: add conditional box shadow to each stage of confirmation*/}
                            {/*STEP 1*/}
                            <div className={`payment-timing ${currentStage === 1 ? 'active' : 'collapsed'}`}>
                                <h3 className="section-title">1. Choose when to pay</h3>
                                {currentStage === 1 ? (
                                    // Active: full options
                                    <div className='payment-options'>
                                        {/* Pay now */}
                                        <label className={`payment-option payment-radio ${selectedPaymentTiming === 'full' ? 'active' : ''}`}>
                                            <span>Pay ${order.totalPrice + totalFees} now</span>
                                            <input type="radio" name="payment" value="full"
                                                checked={selectedPaymentTiming === 'full'}
                                                onChange={() => setselectedPaymentTiming('full')}
                                            />
                                            <span className='payment-checkmark'></span>
                                        </label>

                                        {/* Pay part now, part later */}
                                        <label className={`payment-option payment-radio split-option ${selectedPaymentTiming === 'split' ? 'active' : ''}`}>
                                            <div className='option-top'>
                                                <span>Pay part now, part later</span>
                                                <input type="radio" name="payment" value="split"
                                                    checked={selectedPaymentTiming === 'split'}
                                                    onChange={() => setselectedPaymentTiming('split')}
                                                />
                                                <span className='payment-checkmark'></span>
                                            </div>
                                            <p className='split-pay'>
                                                ${payNow} now, ${payLater} charged on [date TBD]. No extra fees.  {/*TODO: decide how many days before startDate to charge the second payment*/}
                                                <button className='btn btn-link more-info'>More info</button>
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    // Collapsed: show only a small summary
                                    <p className='payment-timing-summary'>
                                        {selectedPaymentTiming === 'full'
                                            ? `Pay $${order.totalPrice + totalFees} now`
                                            : `Pay $${payNow} now, $${payLater} charged on [date TBD]. No extra fees.`}
                                    </p>
                                )}

                                {currentStage === 1 && (
                                    <button
                                        className='btn btn-black confirm-next'
                                        onClick={handleNextClick}
                                    >Next</button>
                                )}
                            </div>

                            {/*STEP 2*/}
                            <div className={`payment-method ${currentStage === 2 ? 'active' : 'collapsed'}`}>

                                <h3 className="section-title">2. Add a payment method</h3>
                                {currentStage === 2 ? (
                                    <div className="payment-options">
                                        <PaymentMethod onSelect={setSelectedMethod} />
                                    </div>
                                ) : (
                                    <div className="payment-summary">
                                        {selectedMethod?.type === 'card' && (
                                            <>
                                                <div className='collapsed-method-summary'>
                                                    <span className='credit-card-icon'>{paymentSvgs.creditCard}</span>
                                                    <span className='pay-method-label'>{selectedMethod.brand} •••• {selectedMethod.last4}</span>
                                                </div>
                                            </>
                                        )}
                                        {selectedMethod?.type === 'googlepay' && (
                                            <>
                                                <div className='collapsed-method-summary'>
                                                    <span className='googlepay-icon'>{paymentSvgs.googlePay}</span>
                                                    <span className='pay-method-label'>Google Pay</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                {currentStage === 2 && (
                                    <button className="btn btn-black confirm-next" onClick={handleNextClick}>
                                        Next
                                    </button>
                                )}
                            </div>
                            {/*STEP 3*/}
                            <div className={`host-message ${currentStage === 3 ? 'active' : 'collapsed'}`}>
                                <h3 className="section-title">3. Message the host</h3>
                                {currentStage === 3 && (
                                    <div className='msg-host-block'>
                                        <p className='msg-host-intro'>Share why you're traveling, who's coming with you, and what you love about the space.</p>
                                        <div className='msg-host-avatar-greeting'>
                                            <div className='msg-host-avatar'>
                                                <img src={host.imgUrl} className='msg-host-img' />
                                                <div className='msg-host-info'>
                                                    <span className='msg-host-name'>{host.firstName}</span>
                                                    <span className='msg-host-hosting-since'>Hosting since {host.hostingSince}</span>
                                                </div>
                                            </div>
                                            <p className='msg-host-greeting'>Hello, do you have any questions I can help you with?</p>
                                        </div>
                                        <textarea
                                            className='msg-host-textarea'
                                            placeholder={`Hi ${host.firstName}! I'll be visiting...`}
                                            rows={4}
                                        />
                                    </div>
                                )}

                                {currentStage === 3 && (
                                    <div className='msg-host-btn-container'>
                                        <button className="btn btn-black confirm-next" onClick={handleNextClick}>
                                            Done
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/*STEP 4*/}
                            {currentStage === 4 && (
                                <FancyButton onClick={handleReserveClick} className='btn-reserve-small'>
                                    Reserve
                                </FancyButton>

                            )}
                        </div>
                        <ReservationSummary order={order} />
                    </div>
                </section >
            </div >
        </>
    )
}