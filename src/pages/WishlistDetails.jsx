import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { showSuccessMsg } from '../services/event-bus.service'
import { svgControls } from '../cmps/Svgs'

export function WishlistDetails() {
    const { state } = useLocation()
    const { id } = useParams()
    const navigate = useNavigate()

    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const wishlist = state?.wishlist || wishlists.find(wl => wl._id === id)
    const [hoveredId, setHoveredId] = useState(null)
    const [inactiveHearts, setInactiveHearts] = useState([])


    if (!wishlist) return <div>Wishlist not found</div>

    const stays = (wishlist.stays || []).map(stay => ({
        ...stay,
        imgUrls: stay.imgUrls || (stay.imgUrl ? [stay.imgUrl] : []),
    }))

    console.log('wishlist:', wishlist)
    console.log('stays:', wishlist?.stays)

    function onToggleHeart(stay) {
        const isInactive = inactiveHearts.includes(stay._id)

        if (isInactive) {
            // Make it red again
            setInactiveHearts(prev => prev.filter(id => id !== stay._id))
            showSuccessMsg(`Added back to wishlist ${wishlist.title}`, stay.imgUrls?.[0])
        } else {
            // Make it gray temporarily
            setInactiveHearts(prev => [...prev, stay._id])
            try {
                removeStayFromWishlist(wishlist, stay._id)
                showSuccessMsg(`Removed from wishlist ${wishlist.title}`, stay.imgUrls?.[0])
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
    //TEMPORARY FOR DESIGN. LATER add lat and lng to wishlist stay object
    const staysWithCoords = stays.map(stay => ({
        ...stay,
        loc: stay.loc || { lat: 32.08, lng: 34.78 }, // e.g. Tel Aviv fallback
    }))

    return (
        <section className="wishlist-details full">
            <div className="wishlist-items-wrapper">
                <div className="wishlist-details-header">
                    <div className="wishlist-header-top">
                        <button
                            className="btn btn-transparent back-chevron"
                            onClick={handleBackClick}>{svgControls.chevronLeft}
                        </button>

                        <button className="btn btn-transparent menu-dots">
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
            />

        </section>
    )
}

