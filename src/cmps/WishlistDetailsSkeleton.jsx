

export function WishlistDetailsSkeleton() {
    const placeholders = Array.from({ length: 4 })

    return (
        <section className="wishlist-details full">
            {/* Left column */}
            <div className="wishlist-items-wrapper">
                {/* Header */}
                <div className="wishlist-details-header">
                    <div className="skeleton skeleton-title-block large"></div>
                </div>
                {/* Stay grid */}
                <div className="wishlist-details-grid">
                    {placeholders.map((_, idx) => (
                        <div key={idx} className="wishlist-stay-card skeleton-card">
                            <div className="skeleton skeleton-img"></div>
                            <div className="skeleton skeleton-line short"></div>
                            <div className="skeleton skeleton-line"></div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Map placeholder */}
            <div className="explore-map-wrapper">
                <div className="wishlist-map-skeleton skeleton"></div>
            </div>

        </section>
    )
}

