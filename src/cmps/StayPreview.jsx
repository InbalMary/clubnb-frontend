import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatStayDates, calculateNights } from '../services/util.service.js'
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

    const start = filterBy.startDate || stay.suggestedRange?.start || stay.availableFrom
    const end = filterBy.endDate || stay.suggestedRange?.end || stay.availableUntil


    return <article className={`stay-preview ${isBig ? 'big' : ''} ${isFocused ? 'at-focus' : ''}`}>
        <div className='stay-image-wrapper'>

            <Link to={`/stay/${stay._id}?startDate=${start}&endDate=${end}&adults=${filterBy.adults || adults || 1}&children=${filterBy?.children || children}&infants=${filterBy?.infants || infants}&pets=${filterBy?.pets || pets}`
            }
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
                    <Link to={`/stay/${stay._id}?startDate=${start}&endDate=${end}
                    &adults=${filterBy.adults || 1}&children=${filterBy?.children || ''}&infants=${filterBy?.infants}`
                    } className="stay-name">
                        {stay.name}
                    </Link>
                </header>
            )}

            {isBig && (
                <>
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
                </>
            )}
            {!hideDetails && (
                // if small card and user selected dates - show them
                !isBig && hasSelectedDates ? (
                    <p className="stay-card-dates">
                        {formatStayDates(filterBy.startDate, filterBy.endDate)}
                    </p>
                ) : (
                    //  if Explore and no selected dates - show suggested range
                    isBig && !hasSelectedDates && formattedDates ? (
                        <p className="stay-card-dates">{formattedDates}</p>
                    ) : (
                        //small cards, no selected dates - show 2-night default range
                        !isBig && !hasSelectedDates && formattedDates && (
                            <p className="stay-card-dates">{formattedDates}</p>
                        )
                    )
                )
            )}

            <div className='stay-card-details'>
                {!hideDetails && (
                    isBig ? (
                        hasPrice && (
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
                        )
                    ) : (
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
                    ))}

            </div>
            {isBig && !hideDetails && stay.freeCancellation && (
                <p className='explore-cancellation-policy'>Free cancellation</p>
            )}
        </div>
    </article>
}