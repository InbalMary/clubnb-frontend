import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'
import { SearchBar } from './SearchBar'
import { CompactHeader } from './CompactHeader'
import { HamburgerMenu } from './HamburgerMenu.jsx'
import { AppHeaderSkeleton } from './AppHeaderSkeleton'
import { useRef } from 'react'
import { useClickOutside } from '../customHooks/useClickOutside.js'
import { useEscapeKey } from '../customHooks/useEscapeKey.js'

export function AppHeader({ isCompact, onSearchClick, initialModal, onCollapse, isSticky, isTripsPage }) {
	const user = useSelector(storeState => storeState.userModule.user)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)
	const headerRef = useRef(null)
	const location = useLocation()
	const isIndexPage = location.pathname === '/' || location.pathname === ''
	const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3
	const isHostPage = location.pathname.includes("hosting")

	const to = isHostPage ? "/" : "/hosting/reservations"
	const text = isHostPage ? "Switch to traveling" : "Switch to hosting"

	useClickOutside([headerRef], onCollapse)
	useEscapeKey(onCollapse)

	// Show skeleton only during initial loading
	if (isLoading) {
		return <AppHeaderSkeleton isCompact={isCompact} isIndexPage={isIndexPage} />
	}

	const headerClass = isCompact
		? `compact-header full ${!isSticky ? 'no-sticky main-content' : ''} ${isIndexPage ? 'index-page' : ''}`
		: `app-header full ${isIndexPage ? 'index-page' : ''}`

	const containerClass = isCompact ? 'compact-header-content' : 'nav-bar'

	return (
		<header className={headerClass} ref={headerRef}>
			<div className={containerClass}>
				<NavLink to="/" className="logo-header">
					<span className="icon">{appHeaderSvg.logo}</span>
					<span className="brand">clubnb</span>
				</NavLink>

				{isCompact && isHostPage && (
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
				)}

				{isCompact && !isHostPage && (
					<CompactHeader
						onSearchClick={onSearchClick}
						isTripsPage={isTripsPage}
						isStayDetailsPage={isStayDetailsPage}
					/>
				)}

				{!isCompact && user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

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

			{!isCompact && (
				<div className="expanded-header-search">
					<SearchBar initialModal={initialModal} />
				</div>
			)}
		</header>
	)
}