
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { statSvgs, badgesSvgs, svgControls, appHeaderSvg } from '../cmps/Svgs'
import { formatStayDates } from '../services/util.service'
import { demoOrders } from '../data/demo-orders'


export function ConfirmPay() { //later send order as a prop from a parent
    const { stayId } = useParams()
    console.log('Confirming stay:', stayId)

    const order = demoOrders[0]
    const stay = order.stay
    const totalFees = order.cleaningFee + order.serviceFee
    const totalPrice = order.totalPrice
    const payNow = +(totalPrice * 0.2).toFixed(2)
    const payLater = +(totalPrice - payNow).toFixed(2)
    const pricePerNight = order.pricePerNight
    const isGuestFavorite = stay.isGuestFavorite
    const ifIsRareFind = stay.isRareFind
    const { adults, children, infants } = order.guests
    const year = new Date(order.startDate).getFullYear()

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

            <section className="confirm-pay-page">
                <button className="btn btn-gray back">{svgControls.backArrow}</button>
                <h1 className="confirm-pay-title">Confirm and pay</h1>
                <div className="confirm-layout">
                    {/* LEFT: main flow */}
                    <div className="confirm-main">
                        {/*TODO: add conditional box shadow to each stage of confirmation*/}
                        <div className="payment-timing">
                            <div className='payment-options'>
                                <h3 className="section-title">1. Choose when to pay</h3>
                                <label className="payment-timing-option payment-radio">
                                    <span>Pay ${order.totalPrice + totalFees} now</span>
                                    <input type="radio" name="payment" value="full" />
                                    <span className='payment-checkmark'></span>
                                </label>

                                <label className="payment-timing-option split-option payment-radio">
                                    <div className='option-top'>
                                        <span>Pay part now, part later</span>
                                        <input type="radio" name="payment" value="split" />
                                        <span className='payment-checkmark'></span>
                                    </div>

                                    <p className='split-pay'>
                                        ${payNow} now, ${payLater} charged on [date TBD]. No extra fees.  {/*TODO: decide how many days before startDate to charge the second payment*/}
                                        <button className='btn btn-link more-info'>More info</button>
                                    </p>
                                </label>
                            </div>
                            <button className='btn btn-black confirm-next'>Next</button>
                        </div>

                        <div className="payment-method">
                            <h3 className="section-title">2. Add payment method</h3>
                            {/* credit card / PayPal / etc. */}
                        </div>
                        <div className="host-message">
                            <h3 className="section-title">3. Message the host</h3>
                            {/* textarea for message */}
                        </div>
                        <div className="reservation-review">
                            <h3 className="section-title">4. Review your reservation</h3>
                            {/* reservation summary */}
                        </div>
                    </div>


                    <div className='reservation-summary-wrapper'>
                        {/* RIGHT: summary card */}
                        <aside className="reservation-summary">
                            <div className='reservation-summary-order'>
                                <img src={stay.imgUrl} alt="Order preview" className='reservation-summary-img' />
                                <div className="reservation-summary-info">
                                    <h3 className='reservation-summary-title'>{stay.name}</h3>
                                    <div className="reservation-summary-details">
                                        <span className='reservation-summary-rating'>
                                            <span className='reservation-summary-star'>{statSvgs.starSmall}</span>
                                            {stay.rating} ({stay.numReviews})
                                        </span>
                                        {isGuestFavorite && (
                                            <span className='reservation-summary-badge'>
                                                <span className='guest-favorite-icon'>{badgesSvgs.guestFavorite}</span>Guest favorite</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='cancellation-policy'>
                                <p>Free cancellation</p>
                                <p>Cancel before [date TBD] for a full refund.
                                    <button className='btn btn-link'>Full policy</button>
                                </p> {/*Implement this function*/}

                            </div>
                            <div className='reservation-summary-dates'>
                                <p>Dates</p>
                                <p>{formatStayDates(order.startDate, order.endDate)}, {year}</p>
                            </div>
                            <div className='reservation-summary-guests'>
                                <p>Guests</p>
                                <p>{adults} adults</p>
                                {children > 0 && <p>{children} {children === 1 ? 'child' : 'children'}</p>}
                                {infants > 0 && <p>{infants} {infants === 1 ? 'infant' : 'infants'}</p>}
                            </div>
                            <div className='reservation-price'>
                                {/* TODO: replace static values with dynamic calculation */}
                                <p>Price details</p>
                                <div className="price-details">
                                    <div className='reservation-total-nights'>
                                        <p>{order.numNights} nights x ${pricePerNight}</p>
                                        <span>${totalPrice}</span>
                                    </div>
                                    <div className='cleaning-fee'>
                                        <p>Cleaning fee</p>
                                        <span>${order.cleaningFee}</span>
                                    </div>
                                    <div className='service-fee'>
                                        <p>Clubnb service fee</p>
                                        <span>${order.serviceFee}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='reservation-summary-total'>
                                <p>Total</p>
                                <div className='total-amount'>
                                    <span className='reservation-currency'> USD</span> {/*TODO: change later to a button link for dynamic currency change options modal */}
                                    <span className='reservation-final-total'>${order.totalPrice + totalFees}</span>
                                </div>
                                <button className='btn btn-link price-breakdown'>Price breakdown</button> {/*TODO: later add modal onClick */}
                            </div>
                        </aside>
                        {ifIsRareFind && (
                            <div className='rare-find'>
                                <span className='rare-find-icon'>{badgesSvgs.rareFind}</span>
                                <div className='rare-find-text'>
                                    <p>This is a rare find</p>
                                    <p>{order.host.firstName}'s place is usually booked.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}