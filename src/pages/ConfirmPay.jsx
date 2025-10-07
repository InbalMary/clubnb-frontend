
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { appHeaderSvg } from '../cmps/Svgs'

import { statSvgs, badgesSvgs } from '../cmps/Svgs'
import { formatStayDates } from '../services/util.service'
import { demoOrders } from '../data/demo-orders'


export function ConfirmPay() { //later send order as a prop from a parent
    const { stayId } = useParams()
    console.log('Confirming stay:', stayId)

    const order = demoOrders[0]
    const stay = order.stay
    const totalFees = order.cleaningFee + order.serviceFee
    const totalPrice = order.totalPrice
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
                <h1 className="confirm-pay-title">Confirm and pay</h1>
                <div className="confirm-layout">
                    {/* LEFT: main flow */}
                    <div className="confirm-main">


                        <div className="payment-timing">
                            <h3 className="section-title">Choose when to pay</h3>
                            {/* payment timing options go here */}
                        </div>

                        <div className="payment-method">
                            <h3 className="section-title">Add payment method</h3>
                            {/* credit card / PayPal / etc. */}
                        </div>
                        <div className="host-message">
                            <h3 className="section-title">Message the host</h3>
                            {/* textarea for message */}
                        </div>
                        <div className="reservation-review">
                            <h3 className="section-title">Review your reservation</h3>
                            {/* reservation summary */}
                        </div>
                    </div>
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
                            <p>Cancel before [date TBD] for a full refund</p> {/*Implement this function*/}
                            <button className='btn btn-link'>Full policy</button>
                        </div>
                        <div className='reservation-summary-dates'>
                            <p>Dates</p>
                            <p>{formatStayDates(order.startDate, order.endDate)}, {year}</p> {/*TODO: find year of order */}
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
                            <p>{order.numNights} X ${pricePerNight} <span>${totalPrice}</span></p>
                            <p>Cleaning fee <span>${order.cleaningFee}</span></p>
                            <p>Clubnb service fee <span>${order.serviceFee}</span></p>
                        </div>
                        <div className='reservation-summary-total'>
                            <p>Total
                                <span className='reservation-currency'> USD</span> {/*TODO: change later to a button link for dynamic currency change options modal */}
                                <span className='reservation-final-total'>${order.totalPrice + totalFees}</span>
                            </p>
                            <button className='btn btn-link price-breakdown'>Price breakdown</button> {/*TODO: later add modal onClick */}
                        </div>
                        {ifIsRareFind && (
                            <div>
                                <p>
                                    <span className='rare-find-icon'>{badgesSvgs.rareFind}</span>
                                    This is a rare find</p>
                                <p>{order.host.firstName}'s is usually booked</p>
                            </div>
                        )}

                    </aside>
                </div>
            </section>
        </>
    )
}