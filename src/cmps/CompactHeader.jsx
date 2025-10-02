import { NavLink } from "react-router";
import { appHeaderSvg } from "./Svgs";

export function CompactHeader({ onSearchClick }) {
    return (
        <header className="compact-header">
            <div className="compact-header-content">
                <NavLink to="/" className="logo-header">
                    <span className="icon">{appHeaderSvg.logo}</span>
                    <span className="brand">clubnb</span>
                </NavLink>

                <button className="compact-search-button" onClick={() => onSearchClick(null)}>
                    <div className="compact-search-content">
                        <span
                            className="compact-search-text"
                            onClick={(ev) => {
                                ev.stopPropagation()
                                onSearchClick('where')
                            }}
                        >
                            <span className="compact-search-icon">🏠</span>
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
                            Anytime
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

                <div className="header-actions">
                    <NavLink to="become-a-host" >
                        <span className="host-link">Become a host</span>
                    </NavLink>

                    <button aria-label="Choose language">
                        <span className='change-lng'>{appHeaderSvg.changeLanguage}</span>
                    </button>

                    <button aria-label="Main menu">
                        <span className='hamburger'>
                            {appHeaderSvg.hamburger}
                            {/* Profile icon*/}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    )
}