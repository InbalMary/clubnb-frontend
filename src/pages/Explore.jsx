import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'
import { useClickOutside } from '../customHooks/useClickOutside'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { Modal } from '../cmps/Modal'
import { svgControls } from '../cmps/Svgs'

export function Explore() {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)

    const wm = useWishlistModal(wishlists)
    const { city } = useParams()
    const [searchParams] = useSearchParams()
    const [hoveredId, setHoveredId] = useState(null)
    const [focusedStayId, setFocusedStayId] = useState(null)
    const previewRef = useRef(null)

    useClickOutside([previewRef], () => {
        setFocusedStayId(null)
    })

    // if (!type || city) return <ExploreSkeleton stays={stays} />
    // if (stays) return<div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

    useEffect(() => {
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const guestsParam = searchParams.get('guests')
        
        const filterParams = {
            city: city || null,
            startDate: startDate || null,
            endDate: endDate || null,
            guests: guestsParam ? parseInt(guestsParam) : null
        }

        loadStays(filterParams)
    }, [city, searchParams])

    const filteredStays = stays?.filter(stay => {
        if (stay.summary?.includes('[IN_PROGRESS:')) {
            return false
        }

        const guestsParam = searchParams.get('guests')
        if (guestsParam) {
            const requestedGuests = parseInt(guestsParam)
            const stayCapacity = stay.capacity || 0
            
            if (stayCapacity < requestedGuests) {
                return false
            }
        }

        return true
    })

    return (
        <section className="explore-page full">
            {isLoading ? (
                <div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

            ) : (
                <>
                    <div className="items-wrapper">

                        <h4 className='explore-title'>Over {filteredStays?.length || 0} homes in {city}</h4>
                        {/* grid of stays */}
                        <div className="explore-grid">
                            {filteredStays?.map(stay => (
                                <div className="div-for-focus"
                                    key={stay._id}
                                    onMouseEnter={() => setHoveredId(stay._id)}
                                    onMouseLeave={() => setHoveredId(null)}

                                    tabIndex={0}
                                >
                                    <StayPreview key={stay._id}
                                        stay={stay}
                                        isBig={true}
                                        onToggleWishlist={wm.onToggleWishlist}
                                        isFocused={focusedStayId === stay._id}
                                        // onRequestFocus={() => setFocusedStayId(stay._id)}
                                        onRequestFocus={() => {
                                            console.log('Focus requested for', stay._id)
                                            setFocusedStayId(stay._id)
                                        }}
                                        hideDetails={filterBy?.startDate && filterBy?.endDate}
                                    />
                                </div>

                            ))}
                        </div>
                    </div>
                    <ExploreMap tabIndex={0} locations={filteredStays} hoveredId={hoveredId} onToggleWishlist={wm.onToggleWishlist} />
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
                ></Modal>
            )}
        </section >
    )
}

