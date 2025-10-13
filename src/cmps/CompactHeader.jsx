import { NavLink, useLocation } from "react-router";
import { appHeaderSvg } from "./Svgs";
import { HamburgerMenu } from "./HamburgerMenu";
import { useSelector } from "react-redux";

export function CompactHeader({ onSearchClick, isSticky, isTripsPage }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const location = useLocation()
    const isIndexPage = location.pathname === '/' || location.pathname === ''
    const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3
    const isHostPage = location.pathname.includes("hosting")

    const to = isHostPage ? "/" : "/hosting"
    const text = isHostPage ? "Switch to traveling" : "Switch to hosting"

    return (
        <header className={`compact-header full ${!isSticky ? 'no-sticky' : ''} ${isIndexPage ? 'index-page' : ''}`}>
            <div className="compact-header-content">
                <NavLink to="/" className="logo-header">
                    <span className="icon">{appHeaderSvg.logo}</span>
                    <span className="brand">clubnb</span>
                </NavLink>

                {/* Host Navigation - replaces searchBar when on host page */}
                {isHostPage ? (
                    <nav className="host-navigation">
                        <NavLink
                            to="/hosting/reservations"
                            className={({ isActive }) => `host-nav-item ${isActive ? 'active' : ''}`}
                        >
                            Reservations
                        </NavLink>
                        <NavLink
                            to="/hosting/listings"
                            className={({ isActive }) => `host-nav-item ${isActive ? 'active' : ''}`}
                        >
                            Listings
                        </NavLink>
                    </nav>
                ) : (
                    <button className={`compact-search-button ${isTripsPage ? 'hidden' : ''}`} onClick={() => onSearchClick(null)}>
                        <div className="compact-search-content">
                            <span
                                className="compact-search-text"
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    onSearchClick('where')
                                }}
                            >
                                <span className="compact-search-icon"><img className="anywhere-icon" src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240" alt="" /></span>
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
                )}

                <div className="header-actions">
                    <NavLink to={to}>
                        <span className="host-link">{text}</span>
                    </NavLink>

                    {user && user.imgUrl ? (
                        <button className='profile-icon'>
                            <img src={user.imgUrl} alt={user.fullname} />
                        </button>
                    ) : (
                        <button aria-label="Choose language">
                            <span className='change-lng'>{appHeaderSvg.changeLanguage}</span>
                        </button>
                    )}

                    <HamburgerMenu />
                </div>
            </div>
        </header>
    )
}