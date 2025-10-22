import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { Modal } from '../cmps/Modal'

export function Explore() {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const wm = useWishlistModal(wishlists)
    const { city } = useParams()
    const [hoveredId, setHoveredId] = useState(null)

    useEffect(() => {
        if (city) {
            loadStays({ city })
        } else {
            loadStays()
        }
    }, [city])

    // if (!type || city) return <ExploreSkeleton stays={stays} />
    // if (stays) return<div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

    return (
        <section className="explore-page full">
            {isLoading ? (
                <div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

            ) : (
                <>
                    <div className="items-wrapper">

                        <h4 className='explore-title'>Over {stays?.length - 1} homes in {city}</h4>
                        {/* grid of stays */}
                        <div className="explore-grid">
                            {stays?.filter(stay => !stay.summary?.includes('[IN_PROGRESS:')).map(stay => (
                                <div
                                    key={stay._id}
                                    onMouseEnter={() => setHoveredId(stay._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <StayPreview key={stay._id} stay={stay} isBig={true} onToggleWishlist={wm.onToggleWishlist} />
                                </div>

                            ))}
                        </div>
                    </div>
                    <ExploreMap locations={stays} hoveredId={hoveredId} onToggleWishlist={wm.onToggleWishlist} />
                </>
            )}

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
                                <img src={wishlist.stays?.[0].imgUrl} alt={wishlist.title} className="wishlist-modal-img" />
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
                ></Modal>
            )}
        </section >
    )
}

