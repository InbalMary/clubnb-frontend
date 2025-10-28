
import { statSvgs, badgesSvgs } from '../cmps/Svgs'
import { formatStayDates, getDateBefore } from '../services/util.service'

export function ReservationSummary({ order }) {

    const stay = order.stay
    const totalFees = order.cleaningFee + order.serviceFee
    const totalPrice = order.totalPrice
    const pricePerNight = order.pricePerNight
    const dateBefore = getDateBefore(order.startDate)

    const { adults, children, infants } = order.guests
    const year = new Date(order.startDate).getFullYear()
    const isGuestFavorite = order.stay?.host?.rating > 4.8
    const isRareFind = order.stay?.host?.numReviews > 100

    return (
        <div className='reservation-summary-wrapper'>
            {/* RIGHT: summary card */}
            <aside className="reservation-summary">
                <div className='reservation-summary-order'>
                    <img src={stay.imgUrls[0]} alt="Order preview" className='reservation-summary-img' />
                    <div className="reservation-summary-info">
                        <h3 className='reservation-summary-title'>{stay.name}</h3>
                        <div className="reservation-summary-details">
                            <span className='reservation-summary-rating'>
                                <span className='reservation-summary-star'>{statSvgs.starSmall}</span>
                                {stay.host.rating} ({stay.host.numReviews})
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
                    <p className='cancel-inline'>
                        Cancel before {dateBefore} for a full refund.{' '}
                        <button className='btn btn-link cancel-link'>Full policy</button>
                    </p> {/*Implement this function*/}
                </div>
                <div className='reservation-summary-dates'>
                    <p>Dates</p>
                    <p>{formatStayDates(order.startDate, order.endDate)}, {year}</p>
                </div>
                <div className='reservation-summary-guests'>
                    <p>Guests</p>
                    <p className='guests-inline'>
                        <span>{adults} {adults === 1 ? 'adult' : 'adults'}</span>
                        {children > 0 && <span>{children} {children === 1 ? 'child' : 'children'}</span>}
                        {infants > 0 && <span>{infants} {infants === 1 ? 'infant' : 'infants'}</span>}
                    </p>
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
            {isRareFind && (
                <div className='rare-find'>
                    <span className='rare-find-icon'>{badgesSvgs.rareFind}</span>
                    <div className='rare-find-text'>
                        <p>This is a rare find</p>
                        <p>{order.host.firstName}'s place is usually booked.</p>
                    </div>
                </div>
            )}
        </div>
    )
}