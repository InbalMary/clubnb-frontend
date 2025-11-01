import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { removeWishlist } from "../store/actions/wishlist.actions"
import { svgControls } from "../cmps/Svgs"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { WishlistIndexSkeleton } from "../cmps/WishlistIndexSkeleton"
import { useWishlistModal } from "../customHooks/useWishlistModal"
import { LoginSignupModal } from "../cmps/LoginSignupModal"

export function WishlistIndex() {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const isLoading = useSelector(storeState => storeState.wishlistModule.isLoading)
    const navigate = useNavigate()
    const wm = useWishlistModal(wishlists)


    async function onRemoveWishlist(wishlist) {
        try {
            await removeWishlist(wishlist._id)
            showSuccessMsg(`Wishlist ${wishlist.title} deleted`, wishlist.stays?.[0]?.imgUrls?.[0])
        } catch (err) {
            console.error('Failed to delete wishlist:', err)
            showErrorMsg('Could not delete wishlist, please try again.')
        }
    }

    if (isLoading) return <WishlistIndexSkeleton />

    return (
        <>
            {!wishlists?.length ? (
                <section className="wishlists-index empty">
                    <div className="wishlist-page-container">
                        <h1 className="wishlists-index-title">Wishlists</h1>
                        <p>No wishlists yet. Start saving your favorite stays!</p>
                        <button className="btn btn-gray back-to-prev" onClick={() => navigate(-1)}>
                            <span className="icon">{svgControls.backArrow}</span>
                            Back
                        </button>
                    </div>
                </section>
            ) : (
                <section className="wishlists-index">
                    <div className="wishlist-page-container">
                        <h1 className="wishlists-index-title">Wishlists</h1>
                        <ul className="wishlist-list">
                            {wishlists.map(wishlist => {
                                const firstStay = wishlist.stays?.[0]
                                return (
                                    <li key={wishlist._id} className="wishlist-preview">
                                        <button
                                            className="btn wishlist-delete"
                                            onClick={(ev) => {
                                                ev.preventDefault()
                                                ev.stopPropagation()
                                                onRemoveWishlist(wishlist)
                                            }}
                                        >{svgControls.closeModal}</button>
                                        <Link to={`/wishlists/${wishlist._id}`}
                                            state={{ wishlist }}
                                        >
                                            <img
                                                src={firstStay?.imgUrls?.[0]}
                                                alt={firstStay?.name || 'Wishlist preview'}
                                                className="wishlist-stay-img"
                                            />
                                            <div className="wishlist-info">
                                                <h4>{wishlist.title}</h4>
                                                <p>{wishlist.stays?.length || 0} saved</p>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </section>
            )}

            {wm.isSignupModalOpen && (
                <LoginSignupModal
                    isOpen={wm.isSignupModalOpen}
                    onClose={() => wm.setIsSignupModalOpen(false)}
                    className="signup-invite-modal"
                    title={wm.signupModalProps.title}
                    subtitle={wm.signupModalProps.subtitle}
                    onLoginSuccess={wm.handlePostLoginFlow}
                />
            )}
        </>
    )
}