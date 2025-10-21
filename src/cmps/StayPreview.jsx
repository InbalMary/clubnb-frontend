import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { formatStayDates, calculateNights, formatDate } from '../services/util.service.js'
import { svgControls, statSvgs } from './Svgs.jsx'
import { Modal } from './Modal.jsx'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { SingleImgCarousel } from './SingleImgCarousel.jsx'
import { addWishlist, removeStayFromWishlist, removeWishlist, addStayToWishlist } from '../store/actions/wishlist.actions.js'
import { demoWishlists } from '../data/demo-wishlist.js'


export function StayPreview({ stay, isBig = false, isFocused, onRequestFocus }) {
    const navigate = useNavigate() //TEMPORARY to see wishlist CRUD
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
    const [isCreateWishlistModalOpen, setIsCreateWishlistModalOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [showInputClearBtn, setShowInputClearBtn] = useState(true)

    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)

    const isAddedToWishlist = wishlists.some(wl =>
        wl.stays.some(stayInList => stayInList._id === stay._id)
    )

    const isGuestFavorite = stay.host?.rating > 4.8

    function onCloseWishlistModal() {
        setIsWishlistModalOpen(false)
    }

    async function onCreateWishlist() {
        try {
            const year = new Date().getFullYear()
            const title = newTitle?.trim() ? newTitle : `${stay.loc.city}, ${stay.loc.country} ${year}`
            const newWishlist = {
                title,
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
            navigate('/wishlists') //Temporary navigate
            setIsWishlistModalOpen(false)
            setNewTitle('')
            setShowInputClearBtn(false)
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
                        showSuccessMsg(`Wishlist ${wishlistWithStay.title} deleted`, stay.imgUrls?.[0])
                    } else {
                        await removeStayFromWishlist(wishlistWithStay, stay._id)
                        console.log(stay._id, 'removed from wishlist')
                        showSuccessMsg(`Removed from wishlist ${wishlistWithStay.title}`, stay.imgUrls?.[0])
                    }
                }
            } else {
                setIsWishlistModalOpen(true)
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err)
            showErrorMsg('Could not update wishlist, please try again.')
        }
    }

    async function onSelectWishlistFromModal(wishlist) {
        try {
            const updatedWishlist = await addStayToWishlist(wishlist, stay)
            setIsWishlistModalOpen(false)
            showSuccessMsg(`Added to wishlist ${updatedWishlist.title}`, stay.imgUrls?.[0])
            navigate('/wishlists') //Temprary navigate
        } catch (err) {
            console.error('Cannot add stay to wishlist', err)
            showErrorMsg('Could not add to wishlist, please try again.')
        }
    }

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
                        <button onClick={() => {
                            setIsWishlistModalOpen(false)
                            setNewTitle(`${stay.loc.city}, ${stay.loc.country} ${new Date().getFullYear()}`)
                            setShowInputClearBtn(true)
                            setIsCreateWishlistModalOpen(true)

                        }}
                            className='create-wishlist-btn'>
                            Create new wishlist
                        </button>
                    }
                >
                    <div className='wishlist-modal'>
                        <ul className='wishlist-modal-list'>
                            {wishlists.map(wishlist => (
                                <li
                                    key={wishlist._id}
                                    onClick={() => onSelectWishlistFromModal(wishlist)}
                                >
                                    <img src={wishlist.stays?.[0].imgUrl} alt={wishlist.title} className="wishlist-modal-img" />
                                    <span className="stay-name">{wishlist.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal>
            )}
            {isCreateWishlistModalOpen && (
                <Modal
                    header={
                        <>
                            <button className='btn btn-transparent btn-round back'
                                onClick={() => {
                                    setIsCreateWishlistModalOpen(false)
                                    setIsWishlistModalOpen(true)
                                }}
                            >
                                {svgControls.backArrow}
                            </button>
                            <span className='creat-wishlist-modal-title'>Create wishlist</span>
                        </>
                    }
                    isOpen={isCreateWishlistModalOpen}
                    onClose={() => {
                        setIsCreateWishlistModalOpen(false)
                        setIsWishlistModalOpen(true)
                    }}
                    className="create-wishlist-modal"
                    showCloseBtn={false}
                    footer={
                        <div className="create-footer-actions">
                            <button className='btn create-cancel-btn btn-transparent'
                                onClick={() => {
                                    setIsCreateWishlistModalOpen(false)
                                    setIsWishlistModalOpen(true)
                                }}>
                                Cancel
                            </button>
                            <button className='btn create-btn btn-black'
                                onClick={onCreateWishlist}>
                                Create
                            </button>
                        </div>
                    }
                >
                    <div className='rename-input-wrapper'>
                        <input
                            className='rename-input'
                            type="text"
                            value={newTitle}
                            onChange={(ev) => {
                                setNewTitle(ev.target.value)
                                if (ev.target.value !== '') {
                                    setShowInputClearBtn(false)
                                }
                            }}
                            placeholder="Name"
                        />
                        {showInputClearBtn && newTitle && (
                            <button
                                type="button"
                                className="btn btn-gray btn-round clear-input-btn"
                                onClick={() => {
                                    setNewTitle('')
                                    setShowInputClearBtn(false)
                                }}
                            >
                                {svgControls.closeModal}
                            </button>
                        )}
                    </div>

                </Modal>
            )}
        </div>
        <div className="stay-info">
            {isBig ? (
                // Explore layout: name + rating on one line
                <div className="stay-header">
                    <span className="stay-name">{stay.name}</span>
                    <span className="stay-rating">{statSvgs.starSmall}{stay.rating}<span className="gap" />({stay.numReviews || 0})</span>
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