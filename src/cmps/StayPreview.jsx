import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { formatStayDates, calculateNights, formatDate } from '../services/util.service.js'
import { svgControls, statSvgs } from './Svgs.jsx'
import { Modal } from './Modal.jsx'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { SingleImgCarousel } from './SingleImgCarousel.jsx'
import { addWishlist, removeStayFromWishlist, removeWishlist } from '../store/actions/wishlist.actions.js'

export function StayPreview({ stay, isBig = false }) {
    // console.log('Stay recieved in preview:', stay);
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const navigate = useNavigate()
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false)

    const isGuestFavorite = stay.host?.rating > 4.8

    function onCloseWishlistModal() {
        setIsWishlistModalOpen(false)
    }

    async function onCreateWishlist() {
        try {
            const year = new Date().getFullYear()
            const newWishlist = {
                title: `${stay.loc.city}, ${stay.loc.country} ${year}`,
                city: stay.loc.city,
                country: stay.loc.country,
                stays: [
                    {
                        _id: stay._id,
                        name: stay.name,
                        imgUrl: stay.imgUrls?.[0]
                    }
                ],
                createdAt: Date.now(),
            }
            const savedWishlist = await addWishlist(newWishlist)
            console.log(`${stay.name} was added to wishlist ${savedWishlist.title}`)
            showSuccessMsg(`Created wishlist ${savedWishlist.title}`, stay.imgUrls?.[0])
            navigate('/wishlists')

            setIsAddedToWishlist(true) // heart becomes red
            setIsWishlistModalOpen(false)
        } catch (err) {
            console.error('Cannot create wishlist', err)
        }
    }

    async function onToggleWishlist() {
        console.log('heart clicked')
        try {
            if (isAddedToWishlist) {
                const wishlistWithStay = wishlists.find(wishlist =>
                    wishlist.stays.some(stayInList => stayInList._id === stay._id)
                )
                if (wishlistWithStay) {
                    if (wishlistWithStay.stays.length === 1) {
                        await removeWishlist(wishlistWithStay._id)
                        console.log('Removed entire wishlist', wishlistWithStay._id)
                        console.log('Deleting from wishlistWithStay:', wishlistWithStay)
                        showSuccessMsg(`Wishlist ${wishlistWithStay.title} deleted`, stay.imgUrls?.[0])
                    } else {
                        await removeStayFromWishlist(wishlistWithStay, stay._id)
                        console.log(stay._id, 'removed from wishlist')
                        showSuccessMsg(`Removed from wishlist ${wishlistWithStay.title}`, stay.imgUrls?.[0])
                    }
                }
                setIsAddedToWishlist(false) // heart unclicked
            } else {
                setIsWishlistModalOpen(true)
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err)
        }
    }

    const formattedDates = formatStayDates(stay.startDate, stay.endDate)
    const numNights = calculateNights(stay.startDate, stay.endDate)
    const totalPrice = stay.price * numNights

    return <article className={`stay-preview ${isBig ? 'big' : ''}`}>
        <div className='stay-image-wrapper'>

            <Link to={`/stay/${stay._id}?startDate=${stay.startDate}&endDate=${stay.endDate}`}
                className='stay-link'
                target="_blank"
                rel="noopener noreferrer"
            >
                {isBig ? (
                    <SingleImgCarousel images={stay.imgUrls} />
                ) : (
                    <img
                        src={stay.imgUrls?.[0] || 'https://picsum.photos/200/200?random=1'}
                        alt={stay.name}
                        className='stay-image'
                    />
                )}
            </Link>

            <button
                onClick={onToggleWishlist}
                className={`heart-btn ${isAddedToWishlist ? 'active' : ''}`}
                aria-label={isAddedToWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <span className="heart-icon">{svgControls.heart}</span>
            </button>
            {isGuestFavorite && (
                <div className='guest-favorite-badge'>Guest favorite</div>
            )}
            {isWishlistModalOpen && (
                <Modal
                    header="Save to wishlist"
                    isOpen={isWishlistModalOpen}
                    onClose={onCloseWishlistModal}
                    closePosition="right"
                    className="wishlist-modal"
                    footer={
                        <button onClick={onCreateWishlist} className='create-wishlist-btn'>
                            Create new wishlist
                        </button>
                    }
                >
                    <div className='wishlist-modal'>
                        {/* TODO later: check for existing wishlists for this user/stay and render selection here */}
                        <ul className='wishlist-modal-list'> {/*placeholder for wishlist data*/}
                            <li>
                                <img src="https://a0.muscache.com/im/pictures/eaaf0e52-c8b3-49c6-b79b-51188e5fb598.jpg?im_w=720"
                                    className='wishlist-modal-img' />
                                <span className='stay-name'>Barcelona trip</span>
                            </li>
                            <li>
                                <img src="https://a0.muscache.com/im/pictures/21820279/b015a76d_original.jpg?im_w=720"
                                    className='wishlist-modal-img' />
                                <span className='stay-name'>Berlin weekend</span>
                            </li>
                            <li>
                                <img src="https://a0.muscache.com/im/pictures/a113bb3b-58db-40f1-975e-538372cab82e.jpg?im_w=720"
                                    className='wishlist-modal-img' />
                                <span className='stay-name'>Paris</span>
                            </li>
                            <li>
                                <img src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-38518438/original/9ee33bf2-5e7e-41e2-a643-152e26bd470e.jpeg?im_w=720"
                                    className='wishlist-modal-img' />
                                <span className='stay-name'>London</span>
                            </li>
                            <li>
                                <img src="https://a0.muscache.com/im/pictures/hosting/Hosting-1508277709145554241/original/c86ae438-462e-468f-a7d5-f2d321ee8bf8.jpeg?im_w=720"
                                    className='wishlist-modal-img' />
                                <span className='stay-name'>New York</span>
                            </li>
                        </ul>

                    </div>

                </Modal>
            )}
        </div>
        <div className="stay-info">
            {isBig ? (
                // Explore layout: name + rating on one line
                <div className="stay-header">
                    <span className="stay-name">{stay.name}</span>
                    <span className="stay-rating">{statSvgs.starSmall}{stay.rating}({stay.numReviews || 0})</span>
                </div>
            ) : (
                // Default layout (non-Explore)
                <header>
                    <Link to={`/stay/${stay._id}?startDate=${stay.startDate}&endDate=${stay.endDate}`} className="stay-name"
                        target="_blank"
                        rel="noopener noreferrer">
                        {stay.name}
                    </Link>
                </header>
            )}

            {isBig && (
                <>
                    <p className="stay-summary">{stay.summary}</p>
                    <p className='stay-card-details'>
                        {stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                        <span className='separator'>{' '}•</span>
                        {' '}{stay.beds} {stay.beds === 1 ? 'bed' : 'beds'}
                    </p>
                </>
            )}
            <p className='stay-card-dates'>{formattedDates}</p>
            <div className='stay-card-details'>
                {isBig ? (
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
                )}

            </div>
            {isBig && stay.freeCancellation && (
                <p className='explore-cancellation-policy'>Free cancellation</p>
            )}
        </div>
    </article>
}