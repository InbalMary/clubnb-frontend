import { useSelector } from 'react-redux';
import { appHeaderSvg, svgControls } from './Svgs';
import { NavLink, useLocation } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu';
import { useIsBreakPoint } from '../customHooks/useIsBreakPoint.js';
import { useFooterVisibility } from '../customHooks/useFooterVisibility.js';

export function AppFooter({ isIndexPage, isStayDetailsPage, isSearchOpen }) {
	// const user = useSelector(storeState => storeState.userModule.user)
	const location = useLocation()
	const isEditPage = location.pathname.includes("edit")
	const isMobile = useIsBreakPoint(768)
	const isFooterVisible = useFooterVisibility()

	const isGuestPage = isIndexPage ||
		location.pathname === '/wishlists' ||
		location.pathname === '/trips' ||
		location.pathname === '/messages' ||
		location.pathname === '/explore' ||
		location.pathname.startsWith('/explore/') || 
		location.pathname === '/mobile-profile-menu'

	if (isStayDetailsPage) return null
	if (isMobile && isEditPage) return null

	const footerClasses = isMobile && isGuestPage
		? `app-footer full footer-index ${isFooterVisible && !isSearchOpen ? 'visible' : 'hidden'}`
		: 'app-footer full'

	return (
		<footer className={footerClasses}>
			{/* Desktop Footer */}
			<div className="footer-desktop">
				<p>&copy; Clubnb, Inc.</p>
				<div className='footer-right'>
					<div className='footer-language-group' onClick={() => console.log('TODO: open language selector')}>
						<span className="globe-icon">{appHeaderSvg.changeLanguage}</span>
						<span className='footer-language'>English (US)</span>
					</div>

					<div className='footer-currency-group' onClick={() => console.log('TODO: open currency selector')}>
						<span className='footer-currency'>$</span>
						<span className='footer-currency-name'>USD</span>
					</div>
				</div>
			</div>

			{/* Mobile footer for guest pages (index, wishlists, trips, msgs, explore) */}
			{isMobile && isGuestPage && (
				<nav className="footer-mobile-nav">
					<div className="nav-items">
						<NavLink
							to="/"
							className={({ isActive }) => {
								const isExploreActive = isActive || location.pathname.startsWith('/explore')
								return `nav-item ${isExploreActive ? 'active' : ''}`
							}}
						>
							<span className="footer-icon">{appHeaderSvg.search}</span>
							<span>Explore</span>
						</NavLink>

						<NavLink
							to="/wishlists"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{svgControls.heartOutline}</span>
							<span>Wishlists</span>
						</NavLink>

						<NavLink
							to="/trips"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.logo}</span>
							<span>Trips</span>
						</NavLink>

						<NavLink
							to="/messages"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.msgs}</span>
							<span>Messages</span>
						</NavLink>

						<NavLink /*will be replaced with profile page */
							to="/mobile-profile-menu"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon menu-footer-icon">{svgControls.profile}</span>
							<span>Profile</span>
						</NavLink>
					</div>
				</nav>
			)}

			{/* Mobile footer for hosting pages */}
			{isMobile && !isGuestPage && (
				<nav className="footer-mobile-nav">
					<div className="nav-items">
						<NavLink
							to="/hosting/reservations"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.today}</span>
							<span>Reservations</span>
						</NavLink>

						<NavLink
							to="/hosting/dashboard"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.dashboard}</span>
							<span>Dashboard</span>
						</NavLink>

						<NavLink
							to="/hosting/listings"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.listing}</span>
							<span>Listings</span>
						</NavLink>

						<NavLink
							to="/messages"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon">{appHeaderSvg.msgs}</span>
							<span>Messages</span>
						</NavLink>

						<NavLink
							to="/menu"
							className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
						>
							<span className="footer-icon menu-footer-icon">{appHeaderSvg.menu}</span>
							<span>Menu</span>
						</NavLink>
					</div>
				</nav>
			)}
		</footer>
	)
}