export function StayListSkeleton({ categories }) {
    const placeholders = Array.from({ length: 7 }) // number of skeleton cards

    return (
        <section className="stay-list-section main-container">
            {categories.map(type => (
                <div className="stay-row" key={type}>
                    {/* Row header */}
                    <div className="stay-row-header">
                        <div className="skeleton skeleton-title-block"></div>
                        <div className="carousel-controls">
                            <button disabled className="skeleton skeleton-btn"></button>
                            <button disabled className="skeleton skeleton-btn"></button>
                        </div>
                    </div>

                    {/* Skeleton cards */}
                    <div className="carousel">
                        <ul className="carousel-list">
                            {placeholders.map((_, idx) => (
                                <li key={idx}>
                                    <div className="stay-preview skeleton-card">
                                        <div className="stay-image-wrapper">
                                            <div className="skeleton skeleton-img"></div>
                                        </div>
                                        <div className="stay-info">
                                            <div className="skeleton skeleton-line short"></div>
                                            <div className="skeleton skeleton-line"></div>
                                            <div className="skeleton skeleton-line tiny"></div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </section>
    )
}


