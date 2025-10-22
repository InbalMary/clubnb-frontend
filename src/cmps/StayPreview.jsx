import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatStayDates, calculateNights } from '../services/util.service.js'
import { svgControls, statSvgs } from './Svgs.jsx'
import { SingleImgCarousel } from './SingleImgCarousel.jsx'


export function StayPreview({ stay, isBig = false, isFocused, onRequestFocus, onToggleWishlist, hideDetails, isInactive }) {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const isAddedToWishlist = wishlists.some(wl =>
        wl.stays.some(stayInList => stayInList._id === stay._id)
    )
    const isGuestFavorite = stay.host?.rating > 4.8
    const formattedDates = formatStayDates(stay.startDate, stay.endDate)
    const numNights = calculateNights(stay.startDate, stay.endDate)
    const totalPrice = stay.price * numNights

    return <article className={`stay-preview ${isBig ? 'big' : ''} ${isFocused ? 'at-focus' : ''}`}>
        <div className='stay-image-wrapper'>

            <Link to={`/stay/${stay._id}?startDate=${stay.startDate}&endDate=${stay.endDate}`}
                className='stay-link'
            >
                {isBig ? (
                    <SingleImgCarousel images={stay.imgUrls} onRequestFocus={onRequestFocus} />
                ) : (
                    <img
                        src={stay.imgUrls?.[0] || 'https://picsum.photos/200/200?random=1'}
                        alt={stay.name}
                        className='stay-image'
                    />
                )}
            </Link>

            <button
                onClick={() => onToggleWishlist(stay)}
                className={`heart-btn 
                    ${isAddedToWishlist ? 'active' : ''}
                 ${isInactive ? 'inactive' : ''}`}
                aria-label={isAddedToWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <span className="heart-icon">{svgControls.heart}</span>
            </button>
            {isGuestFavorite && (
                <div className='guest-favorite-badge'>Guest favorite</div>
            )}
        </div>
        <div className="stay-info">
            {isBig ? (
                // Explore layout: name + rating on one line
                <div className="stay-header">
                    <span className="stay-name">{stay.name}</span>
                    <span className="stay-rating">
                        {statSvgs.starSmall}{stay.rating}
                        {!hideDetails && (
                            <>
                                <span className="gap" />
                                ({stay.numReviews || 0})
                            </>
                        )}
                    </span>
                </div>
            ) : (
                // Default layout (non-Explore)
                <header>
                    <Link to={`/stay/${stay._id}?startDate=${stay.startDate}&endDate=${stay.endDate}`} className="stay-name">
                        {stay.name}
                    </Link>
                </header>
            )}

            {isBig && (
                <>
                    <p className="stay-summary">{stay.summary}</p>
                    <p className='stay-card-details'>
                        {!hideDetails && (
                            <>
                                {stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                                <span className='separator'>{' '}•</span>
                            </>
                        )}

                        {' '}{stay.beds} {stay.beds === 1 ? 'bed' : 'beds'}
                    </p>
                </>
            )}
            {!hideDetails && (
                <p className='stay-card-dates'>{formattedDates}</p>
            )}

            <div className='stay-card-details'>
                {!hideDetails && (
                    isBig ? (
                        <div className="stay-price-wrap">
                            <span className="stay-price">
                                ${totalPrice.toLocaleString()}
                            </span>
                            <span className="stay-nights">
                                {' '} for {numNights} {numNights === 1 ? 'night' : 'nights'}
                            </span>
                        </div>

                    ) : (
                        <div className="stay-price-rating">
                            <span className='stay-price'>
                                ${totalPrice.toLocaleString()}{' '}for {numNights} {numNights === 1 ? 'night' : 'nights'}
                            </span>
                            <span className='separator'>{' '}•</span>
                            <span className='stay-rating'>
                                <span className='star-icon-xs'>{statSvgs.starXSmall}</span>
                                <span>{stay.rating || 4.85}</span>
                            </span>
                        </div>
                    ))}

            </div>
            {isBig && stay.freeCancellation && (
                <p className='explore-cancellation-policy'>Free cancellation</p>
            )}
        </div>
    </article>
}