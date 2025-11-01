import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'
import { SearchBar } from './SearchBar'
import { CompactHeader } from './CompactHeader'
import { HamburgerMenu } from './HamburgerMenu.jsx'
import { AppHeaderSkeleton } from './AppHeaderSkeleton'
import { useRef, useState, useEffect } from 'react'
import { useClickOutside } from '../customHooks/useClickOutside.js'
import { useEscapeKey } from '../customHooks/useEscapeKey.js'
import { useIsBreakPoint } from '../customHooks/useIsBreakPoint.js'

export function AppHeader({ isCompact, onSearchClick, initialModal, onCollapse, isSticky, isTripsPage, isWishlistPage, isWishlistDetailsPage, onMobileSearchOpenChange }) {
	const user = useSelector(storeState => storeState.userModule.user)
	const isLoading = useSelector(storeState => storeState.userModule.isLoading)
	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const headerRef = useRef(null)
	const location = useLocation()
	const isIndexPage = location.pathname === '/' || location.pathname === ''
	const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3
	const isHostPage = location.pathname.includes("hosting")
	const isEditPage = location.pathname.includes("edit")
	const isExplorePage = location.pathname.includes("explore")
	const isMobileProfilePage = location.pathname.includes("mobile-profile-menu")
	const isMobile = useIsBreakPoint(768)
	const [imgError, setImgError] = useState(false)

	const to = isHostPage ? "/" : "/hosting/reservations"
	const text = isHostPage ? "Switch to traveling" : "Switch to hosting"

	useClickOutside([headerRef], onCollapse)
	useEscapeKey(onCollapse)

	useEffect(() => {
		setIsInitialLoad(false)
	}, [])

	if (isLoading && !isInitialLoad) {
		return <AppHeaderSkeleton
			isCompact={isCompact}
			isIndexPage={isIndexPage}
			isHostPage={isHostPage}
			isTripsPage={isTripsPage}
			isSticky={isSticky}
		/>
	}

	if (isMobile && isStayDetailsPage) return null
	if (isMobile && isEditPage) return null
	if (isMobileProfilePage) return null

	const headerClass = isCompact
		? `compact-header full ${!isSticky ? 'no-sticky main-content' : ''} ${isIndexPage ? 'index-page' : ''}`
		: `app-header full ${isIndexPage ? 'index-page' : ''}`

	const containerClass = isCompact ? 'compact-header-content' : 'nav-bar'

	function handleImageError() {
		console.log('img failed to load:', user?.imgUrl)
		setImgError(true)
	}

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
						<NavLink
							to="/hosting/dashboard"
							className={({ isActive }) => `host-nav-item ${isActive ? 'active' : ''}`}
						>
							Dashboard
						</NavLink>
					</nav>
				)}

				{/* Desktop compact header - hidden on mobile */}
				{isCompact && !isHostPage && (
					<div className="desktop-compact-header">
						<CompactHeader
							onSearchClick={onSearchClick}
							isTripsPage={isTripsPage}
							isWishlistPage={isWishlistPage}
							isWishlistDetailsPage={isWishlistDetailsPage}
							isStayDetailsPage={isStayDetailsPage}
						/>
					</div>
				)}

				{!isCompact && user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				<div className="header-actions">
					<NavLink to={user ? to : "/auth/login"}>
						<span className="host-link">{user ? text : "Become a host"}</span>
					</NavLink>

					{user && user.imgUrl && !imgError ? (
						<button className='profile-icon'>
							<img
								src={user.imgUrl}
								alt={user.fullname}
								onError={handleImageError}
								referrerPolicy="no-referrer"
							/>
						</button>
					) : user ? (
						<button className='profile-icon profile-initials'>
							{user.fullname?.[0]?.toUpperCase() || 'U'}
						</button>
					) : (
						<button aria-label="Choose language">
							<span className='change-lng'>{appHeaderSvg.changeLanguage}</span>
						</button>
					)}

					<HamburgerMenu />
				</div>
			</div>

			{/* Mobile compact header - uses SearchBar like expanded */}
			{isCompact && !isHostPage && !isTripsPage && !isExplorePage && (
				<div className="mobile-compact-search">
					<SearchBar
						initialModal={initialModal}
						onCollapse={onCollapse}
						onMobileSearchOpenChange={onMobileSearchOpenChange}
					/>
				</div>
			)}

			{/* Desktop expanded header */}
			{!isCompact && (
				<div className="expanded-header-search">
					<SearchBar
						initialModal={initialModal}
						onCollapse={onCollapse}
						onMobileSearchOpenChange={onMobileSearchOpenChange}
					/>
				</div>
			)}
		</header>
	)
}