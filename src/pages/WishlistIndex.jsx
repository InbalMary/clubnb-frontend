import { useSelector } from "react-redux"
import { useEffect } from 'react'
import { Link } from "react-router-dom"
import { loadWishlists, removeWishlist } from "../store/actions/wishlist.actions"
import { svgControls } from "../cmps/Svgs"
import { showSuccessMsg } from "../services/event-bus.service"

export function WishlistIndex() {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const isLoading = useSelector(storeState => storeState.wishlistModule.isLoading)

    useEffect(() => {
        loadWishlists()
    }, [])

    function onRemoveWishlist(wishlist) {
        removeWishlist(wishlist._id)
        showSuccessMsg(`Wishlist ${wishlist.title} deleted`, wishlist.stays?.[0]?.imgUrl)
    }

    if (isLoading) return <div>Loading wishlists...</div>

    return (
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
                                <Link to={`/wishlists/${wishlist._id}`}>
                                    <img
                                        src={firstStay?.imgUrl}
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
    )
}