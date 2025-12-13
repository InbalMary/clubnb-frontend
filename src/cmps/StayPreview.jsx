import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatStayDates, calculateNights, toUrlDate, getTruthyValues } from '../services/util.service.js'
import { svgControls, statSvgs } from './Svgs.jsx'
import { SingleImgCarousel } from './SingleImgCarousel.jsx'


export function StayPreview({ stay, isBig = false, isFocused, onRequestFocus, onToggleWishlist, hideDetails, isInactive, fromWishlist }) {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
    const [searchParams, setSearchParams] = useSearchParams()

    const adults = searchParams.get('adults')
    const children = searchParams.get('children')
    const infants = searchParams.get('infants')
    const pets = searchParams.get('pets')

    const isAddedToWishlist = wishlists.some(wl =>
        wl.stays.some(stayInList => stayInList._id === stay._id)
    )
    const isGuestFavorite = stay.host?.rating > 4.8

    let formattedDates = null
    let numNights = 0
    const hasPrice = typeof stay.price === 'number' && !isNaN(stay.price)
    const hasSelectedDates = filterBy.startDate && filterBy.endDate

    if (hasSelectedDates) {
        formattedDates = formatStayDates(filterBy.startDate, filterBy.endDate)
        numNights = calculateNights(filterBy.startDate, filterBy.endDate)
    }
    else if (isBig && !hasSelectedDates && stay.suggestedRange) {
        formattedDates = formatStayDates(stay.suggestedRange.start, stay.suggestedRange.end)
        numNights = 5
    }
    else if (!isBig && !hasSelectedDates && stay.suggestedRange) {
        const { start } = stay.suggestedRange
        const startDate = new Date(start)
        const end = new Date(startDate)
        end.setDate(startDate.getDate() + 2)
        formattedDates = formatStayDates(startDate, end)
        numNights = 2
    }

    const startRaw = filterBy.startDate || stay.suggestedRange?.start || stay.availableFrom
    const endRaw = filterBy.endDate || stay.suggestedRange?.end || stay.availableUntil
    const start = startRaw ? toUrlDate(startRaw) : ''
    const end = endRaw ? toUrlDate(endRaw) : ''

    const paramsObj = {
        startDate: start,
        endDate: end,
        adults: (filterBy?.adults ?? (adults ? Number(adults) : 1)) || 1,
        children: (filterBy?.children ?? (children ? Number(children) : null)) || null,
        infants: (filterBy?.infants ?? (infants ? Number(infants) : null)) || null,
        pets: (filterBy?.pets ?? (pets ? Number(pets) : null)) || null,
    }

    const query = new URLSearchParams(getTruthyValues(paramsObj)).toString()
    const to = `/stay/${stay._id}${query ? '?' + query : ''}`


    return <article className={`stay-preview ${isBig ? 'big' : ''} ${isFocused ? 'at-focus' : ''}`}>
        <div className='stay-image-wrapper'>

            <Link to={to}
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

        {isBig ? (
            // Explore layout: name + rating on one line
            <Link to={to} className="stay-info stay-info-link">
                {/* HEADER */}
                <div className="stay-header">
                    <span className="stay-name">{stay.name}</span>
                    <span className="stay-rating">
                        <span className="star-icon-sm">{statSvgs.starSmall}</span>
                        <span>{stay.host?.rating}</span>
                        {!hideDetails && (
                            <>
                                <span className="gap" />
                                ({stay.numReviews || 0})
                            </>
                        )}
                    </span>
                </div>
                {/* SUMMARY + BED DETAILS */}
                <p className="stay-summary" title={stay.summary}>{stay.summary}</p>
                <p className='stay-card-details'>
                    {!hideDetails && (
                        <>
                            {stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                            <span className='separator'>{' '}•</span>
                        </>
                    )}
                    {' '}{stay.beds} {stay.beds === 1 ? 'bed' : 'beds'}
                </p>
                {/* DATES  */}
                {!hideDetails && !hasSelectedDates && formattedDates && (
                    <p className="stay-card-dates">{formattedDates}</p>
                )}
                {/* PRICE */}
                {!hideDetails && hasPrice && (
                    <div className="stay-price-wrap">
                        <span className="stay-price">
                            <span className="price-number">
                                ${(stay.price * numNights).toLocaleString()}
                            </span>
                            <span className="price-text">
                                {` for ${numNights} ${numNights === 1 ? 'night' : 'nights'}`}
                            </span>
                        </span>
                    </div>
                )}
                {/* CANCELLATION*/}
                {!hideDetails && stay.freeCancellation && (
                    <p className="explore-cancellation-policy">Free cancellation</p>
                )}
            </Link>
        ) : (
            // Default layout (non-Explore)
            <>
                <div className="stay-info">
                    <header>
                        <Link to={to}
                            className="stay-name">
                            {stay.name}
                        </Link>
                    </header>
                    {/* SMALL CARD DATES */}
                    {!hideDetails && hasSelectedDates && ( // if small card and user selected dates - show them
                        <p className="stay-card-dates">
                            {formatStayDates(filterBy.startDate, filterBy.endDate)}
                        </p>
                    )}
                    {!hideDetails && !hasSelectedDates && formattedDates && (//small cards, no selected dates - show 2-night default range
                        <p className="stay-card-dates">{formattedDates}</p>
                    )}
                    {/* SMALL CARD PRICE */}
                    {!hideDetails && (
                        <div className="stay-card-details">
                            <div className="stay-price-rating">
                                <span className='stay-price'>
                                    ${(stay.price * numNights).toLocaleString()}
                                    {` for ${numNights} ${numNights === 1 ? 'night' : 'nights'}`}
                                </span>
                                <span className='separator'>{' '}•</span>
                                <span className='stay-rating'>
                                    <span className='star-icon-xs'>{statSvgs.starXSmall}</span>
                                    <span>{stay.host?.rating || 4.85}</span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )}
    </article>
}