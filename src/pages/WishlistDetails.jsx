import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { svgControls } from '../cmps/Svgs'
import { addStayToWishlist, removeStayFromWishlist, removeWishlist } from '../store/actions/wishlist.actions'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { WishlistDetailsSkeleton } from '../cmps/WishlistDetailsSkeleton'
import { Modal } from '../cmps/Modal'

export function WishlistDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const isLoading = useSelector(storeState => storeState.wishlistModule.isLoading)
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const wishlist = wishlists.find(wl => wl._id === id)

    const [hoveredId, setHoveredId] = useState(null)
    const [inactiveHearts, setInactiveHearts] = useState([])
    const [isDotsMenuOpen, setIsDotsMenuOpen] = useState(false)
    const wm = useWishlistModal(wishlists)

    if (!wishlist) return <div>Wishlist not found</div>

    const stays = (wishlist.stays || []).map(stay => ({
        ...stay,
        imgUrls: stay.imgUrls || (stay.imgUrl ? [stay.imgUrl] : []),
    }))

    async function onToggleHeart(stay) {
        const isInactive = inactiveHearts.includes(stay._id)

        if (isInactive) {

            // Make it red again
            setInactiveHearts(prev => prev.filter(id => id !== stay._id))
            showSuccessMsg(`Added back to wishlist ${wishlist.title}`, stay.imgUrls?.[0])
            try {
                await addStayToWishlist(wishlist, stay)
            } catch (err) {
                console.error('Failed to add stay back:', err)
                showErrorMsg('Could not add stay back, please try again.')
            }

        } else {
            // Make it gray temporarily
            setInactiveHearts(prev => [...prev, stay._id])
            showSuccessMsg(`Removed from wishlist ${wishlist.title}`, stay.imgUrls?.[0])
            try {
                removeStayFromWishlist(wishlist, stay._id)

            } catch (err) {
                console.error('Failed to remove stay:', err)
                showErrorMsg('Could not remove from wishlist, please try again.')
                setInactiveHearts(prev => prev.filter(id => id !== stay._id))
            }
        }
    }

    function handleBackClick() {
        navigate(-1)
    }

    function onOpenDotsMenu() {
        setIsDotsMenuOpen(true)
    }

    function onRemoveWishlist(wishlist) {
        removeWishlist(wishlist._id)
        showSuccessMsg(`Wishlist ${wishlist.title} deleted`, wishlist.stays?.[0]?.imgUrls?.[0])
    }

    const staysWithCoords = stays.map(stay => ({
        ...stay,
        loc: stay.loc || { lat: 32.08, lng: 34.78 }, // e.g. Tel Aviv fallback
    }))

    if (isLoading) return <WishlistDetailsSkeleton />
    console.log(svgControls.heart)

    return (
        <section className="wishlist-details full">
            <div className="wishlist-items-wrapper">
                <div className="wishlist-details-header">
                    <div className="wishlist-header-top">
                        <button
                            className="btn btn-transparent back-chevron"
                            onClick={handleBackClick}
                        >
                            {svgControls.chevronLeft}
                        </button>

                        <button
                            className="btn btn-transparent menu-dots"
                            onClick={onOpenDotsMenu}
                        >
                            {svgControls.dotsHorizontal}
                        </button>
                    </div>

                    <h2 className='wishlists-index-title'>{wishlist.title}</h2>
                </div>

                <div className="wishlist-details-grid">
                    {stays.map(stay => (
                        <div
                            key={stay._id}
                            className="wishlist-stay-card"
                            onMouseEnter={() => setHoveredId(stay._id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >

                            <StayPreview
                                stay={stay}
                                isBig={true}
                                onToggleWishlist={onToggleHeart}
                                isInactive={inactiveHearts.includes(stay._id)}
                                hideDetails={true}
                            />
                        </div>

                    ))}
                </div>
            </div>
            <ExploreMap
                locations={staysWithCoords}
                hoveredId={hoveredId}
                onToggleWishlist={onToggleHeart}
                isWishlistMap={true}
                customMarker={(stay, { isActive, isHovered }) => (
                    <div
                        className={`wishlist-marker
                        ${isHovered ? 'hovered' : ''}
                        ${hoveredId === stay._id ? 'hovered-outside' : ''}
                        ${isActive ? 'active' : ''}`}
                    >
                        {svgControls.house}
                        <span className="marker-heart">{svgControls.heart}</span>
                    </div>
                )}
            />
            {/*SETTINGS MODAL*/}
            {isDotsMenuOpen && (
                <Modal
                    header="Settings"
                    isOpen={isDotsMenuOpen}
                    onClose={() => setIsDotsMenuOpen(false)}
                    closePosition="right"
                    className="wishlist-settings-modal"
                >
                    <div className='wishlist-settings-actions'>
                        <div className='rename-wishlist'
                            onClick={() => {
                                setIsDotsMenuOpen(false)
                                wm.setIsRenameModalOpen(true)
                                wm.setNewTitle(wishlist.title)
                            }
                            }
                        >
                            <div className='left'>
                                <span className="pencil">{svgControls.pencil}</span>
                                <span className="label">Rename</span>
                            </div>
                            <span className='settings-chevron'>{svgControls.chevronRight}</span>
                        </div>
                        <div className='delete-wishlist'
                            onClick={() => {
                                setIsDotsMenuOpen(false)
                                wm.setIsDeleteModalOpen(true)
                            }
                            }
                        >
                            <div className='left'>
                                <span className="trash">{svgControls.trash}</span>
                                <span className="label">Delete</span>
                            </div>

                            <span className='settings-chevron'>{svgControls.chevronRight}</span>
                        </div>
                    </div>
                </Modal>
            )}
            {/*RENAME MODAL*/}
            {wm.isRenameModalOpen && (
                <Modal
                    header={
                        <>
                            <button className='btn btn-transparent btn-round back'
                                onClick={() => {
                                    wm.setIsRenameModalOpen(false)
                                    setIsDotsMenuOpen(true)
                                }}
                            >
                                {svgControls.backArrow}
                            </button>
                            <span className='rename-wishlist-modal-title'>Rename wishlist</span>
                        </>
                    }
                    isOpen={wm.isRenameModalOpen}
                    onClose={() => wm.setIsRenameModalOpen(false)}
                    className="create-wishlist-modal"
                    closePosition="right"
                    footer={
                        <div className="create-footer-actions">
                            <button
                                className="btn create-cancel-btn btn-transparent"
                                onClick={() => wm.setIsRenameModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn create-btn btn-black"
                                onClick={() => wm.onRenameWishlist(wishlist._id, wm.newTitle)}
                            >
                                Save
                            </button>
                        </div>
                    }
                >
                    <div className="rename-input-wrapper">
                        <input
                            className="rename-input"
                            type="text"
                            value={wm.newTitle}
                            onChange={ev => {
                                wm.setNewTitle(ev.target.value)
                                wm.setShowInputClearBtn(ev.target.value !== '')
                            }}
                            placeholder="New name"
                        />
                        {wm.newTitle && (
                            <button
                                type="button"
                                className="btn btn-gray btn-round clear-input-btn"
                                onClick={() => {
                                    wm.setNewTitle('')
                                    wm.setShowInputClearBtn(false)
                                }}
                            >
                                {svgControls.closeModal}
                            </button>
                        )}
                    </div>
                </Modal>
            )}
            {/*DELETE MODAL */}
            {wm.isDeleteModalOpen && (
                <Modal
                    header={
                        <div>
                            <button className='btn btn-transparent btn-round back'
                                onClick={() => {
                                    wm.setIsDeleteModalOpen(false)
                                    setIsDotsMenuOpen(true)
                                }}
                            >
                                {svgControls.backArrow}
                            </button>
                            <p className="delete-wishlist-modal-title">Delete this wishlist?</p>
                        </div>

                    }
                    isOpen={wm.isDeleteModalOpen}
                    onClose={() => wm.setIsDeleteModalOpen(false)}
                    showCloseBtn={false}
                    className="delete-wishlist-modal"

                    footer={
                        <div className="delete-footer-actions">
                            <button
                                className="btn create-cancel-btn btn-transparent"
                                onClick={() => {
                                    wm.setIsDeleteModalOpen(false)
                                    setIsDotsMenuOpen(true)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn create-btn btn-black"
                                onClick={() => {
                                    onRemoveWishlist(wishlist)
                                    wm.setIsDeleteModalOpen(false)
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    }
                >

                    <p className='delete-confirm-text'>
                        "{wishlist.title}" will also be permanently deleted for everyone you've shared it with.
                    </p>
                </Modal>
            )}
        </section>
    )
}

