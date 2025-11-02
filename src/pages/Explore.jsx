import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'
import { useClickOutside } from '../customHooks/useClickOutside'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { Modal } from '../cmps/Modal'
import { svgControls } from '../cmps/Svgs'
import { LoginSignupModal } from '../cmps/LoginSignupModal'

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
        const startDate = searchParams.get('startDate') || null
        const endDate = searchParams.get('endDate') || null
        const adults = searchParams.get('adults') || null
        const children = searchParams.get('children') || null

        const totalGuests = (adults || children)
            ? (parseInt(adults || 0) + parseInt(children || 0))
            : null

        const filterParams = {
            city: city || null,
            startDate,
            endDate,
            guests: totalGuests  // sends the actual number of guests..
        }

        // console.log('Loading stays with filter:', filterParams)
        loadStays(filterParams)

    }, [city, searchParams])

    useEffect(() => {
        return () => {
            const isNavigatingHome = window.location.pathname === '/' || window.location.pathname === ''
            if (isNavigatingHome) {
                setFilterBy({
                    destination: null,
                    startDate: null,
                    endDate: null,
                    guests: null
                })
            }
        }
    }, [])

    const filteredStays = stays?.filter(stay => {
        if (stay.summary?.includes('[IN_PROGRESS:')) {
            return false
        }

        const adultsParam = searchParams.get('adults')
        const childrenParam = searchParams.get('children')

        if (adultsParam || childrenParam) {
            const requestedGuests = parseInt(adultsParam || 0) + parseInt(childrenParam || 0)
            const stayCapacity = stay.capacity || stay.guests || 0

            console.log(`Stay ${stay.name}: capacity=${stayCapacity}, requested=${requestedGuests}`)

            if (stayCapacity < requestedGuests) {
                return false
            }
        }

        return true
    })

    return (
        <section className="explore-page full">
            {isLoading ? (
                <div className="loading-overlay">
                    <ExploreSkeleton stays={stays} />
                </div>
            ) : (
                <>
                    <div className="items-wrapper">

                        <h4 className='explore-title'>Over {filteredStays?.length || 0} homes in {city}</h4>
                        {/* grid of stays */}
                        <div className="explore-grid">
                            {filteredStays?.map(stay => (
                                <div
                                    className="div-for-focus"
                                    key={stay._id}
                                    onMouseEnter={() => setHoveredId(stay._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    tabIndex={0}
                                >
                                    <StayPreview
                                        stay={stay}
                                        isBig={true}
                                        onToggleWishlist={wm.onToggleWishlist}
                                        isFocused={focusedStayId === stay._id}
                                        // onRequestFocus={() => setFocusedStayId(stay._id)}
                                        onRequestFocus={() => {
                                            // console.log('Focus requested for', stay._id)
                                            setFocusedStayId(stay._id)
                                        }}
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
                                    if (wishlists.length) wm.setIsWishlistModalOpen(true)
                                }}
                            >
                                {svgControls.backArrow}
                            </button>
                            <span className='creat-wishlist-modal-title'>
                                {wishlists.length === 0
                                    ? 'Create your first wishlist'
                                    : 'Create wishlist'}
                            </span>
                        </>
                    }
                    isOpen={wm.isCreateWishlistModalOpen}
                    onClose={() => {
                        wm.setIsCreateWishlistModalOpen(false)
                        if (wishlists.length) wm.setIsWishlistModalOpen(true)
                    }}
                    className="create-wishlist-modal"
                    showCloseBtn={false}
                    footer={
                        <div className="create-footer-actions">
                            <button className='btn create-cancel-btn btn-transparent'
                                onClick={() => {
                                    wm.setIsCreateWishlistModalOpen(false)
                                    if (wishlists.length) wm.setIsWishlistModalOpen(true)
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
                    <div className="rename-input-wrapper">
                        <input
                            className="rename-input"
                            type="text"
                            value={wm.newTitle}
                            onChange={(ev) => {
                                wm.setNewTitle(ev.target.value)
                                wm.setShowInputClearBtn(ev.target.value !== '')
                            }}
                            placeholder="Name your wishlist"
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
            {wm.isSignupModalOpen && (
                <LoginSignupModal
                    isOpen={wm.isSignupModalOpen}
                    onClose={() => wm.setIsSignupModalOpen(false)}
                    title={wm.signupModalProps.title}
                    subtitle={wm.signupModalProps.subtitle}
                    onLoginSuccess={() => {
                        console.log('✅ Login success from Explore, calling post-login flow')
                        wm.handlePostLoginFlow()
                    }}
                    isFromWishlist={true}
                />
            )}

        </section >

    )
}

