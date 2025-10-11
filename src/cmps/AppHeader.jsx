import { Link, NavLink } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { appHeaderSvg } from './Svgs'
import { SearchBar } from './SearchBar'
import { HamburgerMenu } from './HamburgerMenu.jsx'
import { useEffect, useRef } from 'react'

export function AppHeader({ initialModal, onCollapse }) {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const headerRef = useRef(null)
	const location = useLocation()
    const isIndexPage = location.pathname === '/' || location.pathname === ''

	useEffect(() => {
		function handleClickOutside(event) {
			if (headerRef.current && !headerRef.current.contains(event.target)) {
				onCollapse()
			}
		}

		function handleEscKey(event) {
			if (event.key === 'Escape') {
				onCollapse()
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("keydown", handleEscKey)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("keydown", handleEscKey)
		}
	}, [onCollapse])

	return (
		<header className={`app-header full ${isIndexPage ? 'index-page' : ''}`} ref={headerRef}>
			<nav className='nav-bar'>
				<NavLink to="/" className="logo-header">
					<span className="icon">{appHeaderSvg.logo}</span>
					<span className="brand">clubnb</span>
				</NavLink>

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

				<div className="header-actions">
					<NavLink to="become-a-host" >
						<span className="host-link">Become a host</span>
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
			</nav>

			<div className="expanded-header-search">
				<SearchBar initialModal={initialModal} />
			</div>

		</header>
	)
}