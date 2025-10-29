import { useSelector } from 'react-redux';
import { appHeaderSvg } from './Svgs';
import { NavLink, useLocation } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu';

export function AppFooter({ isIndexPage, isStayDetailsPage }) {
	// const user = useSelector(storeState => storeState.userModule.user)
	// const location = useLocation()
	const showMobileHeaderFooter = isIndexPage || isStayDetailsPage;
	
	if (isStayDetailsPage) return null
	
	return (
		<footer className="app-footer full">
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

			{/* Mobile Header-Style Footer - for index and details pages- temporary */}
			{showMobileHeaderFooter && (
				<div className="footer-mobile-header">
					<NavLink to="/" className="logo-header">
						<span className="icon">{appHeaderSvg.logo}</span>
					</NavLink>

					<div className="header-actions">
						<HamburgerMenu />
					</div>
				</div>
			)}

			{/* Mobile Navigation Footer - for all other pages- for presenting host reservations on mobile..*/}
			{!showMobileHeaderFooter && (
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