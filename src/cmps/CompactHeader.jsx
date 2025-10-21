import { appHeaderSvg } from "./Svgs"

export function CompactHeader({ onSearchClick, isTripsPage, isWishlistPage, isStayDetailsPage }) {
    return (
        <button
            className={`compact-search-button ${isTripsPage || isWishlistPage ? 'hidden' : ''}`}
            onClick={() => onSearchClick(null)}
        >
            <div className="compact-search-content">
                <span
                    className="compact-search-text"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onSearchClick('where')
                    }}
                >
                    <span className="compact-search-icon">
                        <img
                            className="anywhere-icon"
                            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240"
                            alt=""
                        />
                    </span>
                    Anywhere
                </span>
                <span className="compact-search-divider"></span>
                <span
                    className="compact-search-text"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onSearchClick('checkin')
                    }}
                >
                    {isStayDetailsPage ? 'Any week' : 'Anytime'}
                </span>
                <span className="compact-search-divider"></span>
                <span
                    className="compact-search-text"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onSearchClick('who')
                    }}
                >
                    Add guests
                </span>
            </div>
            <div className="compact-search-icon-button">
                <span>{appHeaderSvg.search}</span>
            </div>
        </button>
    )
}