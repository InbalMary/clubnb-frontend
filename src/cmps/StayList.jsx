import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { StayPreview } from './StayPreview'
import { Carousel } from './Carousel'
import { svgControls } from './Svgs'
import { StayListSkeleton } from './StayListSkeleton'
import { Modal } from './Modal.jsx'
import { useWishlistModal } from '../customHooks/useWishlistModal.js'

export function StayList() {
    const navigate = useNavigate()
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const wm = useWishlistModal(wishlists)

    const groups = [...new Set(stays.map(stay => stay.loc.city))]
    if (isLoading) return <StayListSkeleton categories={groups} />

    const rowTitles = groups.map((city, i) => {
        const phrases = [
            'Popular homes in',
            'Explore',
            'Top-rated stays in',
            'Discover',
            'Vacation rentals in',
            'Unique places in',
            'Homes guests love in',
            'Stay near attractions in',
            'Trending destinations in',
            'Beautiful getaways in',
            'Perfect stays for families in',
            'Charming places to stay in'
        ]
        const phrase = phrases[i % phrases.length] //cycle phrases
        return `${phrase} ${city}`
    })

    return (
        <section className='stay-list-section main-container'>
            {groups.map((city, idx) => {
                const rowStays = stays.filter(stay => stay.loc.city === city && !stay.summary?.includes('[IN_PROGRESS:'))
                if (!rowStays.length) return null

                return (
                    <div className='stay-row' key={city}>
                        {/* We pass a function (renderControls) down to Carousel.
                            Carousel will call this function, giving us its scroll state + scroll logic.
                            Whatever JSX we return here gets rendered inside Carousel. */}
                        <Carousel
                            renderControls={({ scrollState, scrollRow }) => (
                                <div className='stay-row-header'>
                                    <h3 className="stay-list-title" onClick={() => navigate(`/explore/city/${city}`)}>{rowTitles[idx]}
                                        <span className='right-pointer'>{svgControls.chevronRight}</span>
                                    </h3>

                                    <div className="carousel-controls">
                                        <button disabled={scrollState.atStart} onClick={() => scrollRow(-1)}>
                                            <span className='carousel-icon'>{svgControls.chevronLeft}</span>
                                        </button>
                                        <button disabled={scrollState.atEnd} onClick={() => scrollRow(1)}>
                                            <span className='carousel-icon'>{svgControls.chevronRight}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        >
                            {rowStays.map((stay) => (
                                <li key={stay._id}>
                                    <StayPreview stay={stay} onToggleWishlist={wm.onToggleWishlist} />
                                </li>
                            ))}
                        </Carousel>
                    </div>
                )
            })}
            {wm.isWishlistModalOpen && wm.activeStay && (
                <Modal
                    header="Save to wishlist"
                    isOpen={wm.isWishlistModalOpen}
                    onClose={() => wm.setIsWishlistModalOpen(false)}
                    closePosition="right"
                    className="wishlist-modal"
                    footer={
                        <button className='create-wishlist-btn'
                            onClick={() => {
                                wm.setIsWishlistModalOpen(false)
                                wm.setNewTitle(`${wm.activeStay.loc.city}, ${wm.activeStay.loc.country} ${new Date().getFullYear()}`)
                                wm.setShowInputClearBtn(true)
                                wm.setIsCreateWishlistModalOpen(true)
                            }}
                        >
                            Create new wishlist
                        </button>
                    }
                >
                    <ul className='wishlist-modal-list'>
                        {wishlists.map(wishlist => (
                            <li
                                key={wishlist._id}
                                onClick={() => wm.onSelectWishlistFromModal(wishlist)}
                            >
                                <img src={wishlist.stays?.[0].imgUrls?.[0]} alt={wishlist.title} className="wishlist-modal-img" />
                                <span className="stay-name">{wishlist.title}</span>
                            </li>
                        ))}
                    </ul>

                </Modal>
            )}
            {wm.isCreateWishlistModalOpen && (
                <Modal
                    header={
                        <>
                            <button className='btn btn-transparent btn-round back'
                                onClick={() => {
                                    wm.setIsCreateWishlistModalOpen(false)
                                    wm.setIsWishlistModalOpen(true)
                                }}
                            >
                                {svgControls.backArrow}
                            </button>
                            <span className='creat-wishlist-modal-title'>Create wishlist</span>
                        </>
                    }
                    isOpen={wm.isCreateWishlistModalOpen}
                    onClose={() => {
                        wm.setIsCreateWishlistModalOpen(false)
                        wm.setIsWishlistModalOpen(true)
                    }}
                    className="create-wishlist-modal"
                    showCloseBtn={false}
                    footer={
                        <div className="create-footer-actions">
                            <button className='btn create-cancel-btn btn-transparent'
                                onClick={() => {
                                    wm.setIsCreateWishlistModalOpen(false)
                                    wm.setIsWishlistModalOpen(true)
                                }}>
                                Cancel
                            </button>
                            <button className='btn create-btn btn-black'
                                onClick={wm.onCreateWishlist}>
                                Create
                            </button>
                        </div>
                    }
                >
                    <div className='rename-input-wrapper'>
                        <input
                            className='rename-input'
                            type="text"
                            value={wm.newTitle}
                            onChange={(ev) => {
                                wm.setNewTitle(ev.target.value)
                                if (ev.target.value !== '') {
                                    wm.setShowInputClearBtn(false)
                                }
                            }}
                            placeholder="Name"
                        />
                        {wm.showInputClearBtn && wm.newTitle && (
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
        </section >
    )
}


