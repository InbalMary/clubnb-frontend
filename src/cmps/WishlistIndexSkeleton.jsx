export function WishlistIndexSkeleton() {
    const placeholders = Array.from({ length: 8 })

    return (
        <section className="wishlists-index">
            <div className="wishlist-page-container">
                <div className="skeleton skeleton-title-block large"></div>

                <ul className="wishlist-list">
                    {placeholders.map((_, idx) => (
                        <li key={idx} className="wishlist-preview skeleton-card">
                            <div className="wishlist-img-skeleton skeleton skeleton-img"></div>
                            <div className="wishlist-info">
                                <div className="skeleton skeleton-line short"></div>
                                <div className="skeleton skeleton-line tiny"></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
