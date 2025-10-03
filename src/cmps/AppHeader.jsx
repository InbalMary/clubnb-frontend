import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { appHeaderSvg } from './Svgs'
import { SearchBar } from './SearchBar'
import { useEffect, useRef } from 'react'

export function AppHeader({ initialModal, onCollapse }) {
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const headerRef = useRef(null)

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

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	return (
		<header className="app-header full" ref={headerRef}>
			<nav className='nav-bar'>
				<NavLink to="/" className="logo-header">
					<span className="icon">{appHeaderSvg.logo}</span>
					<span className="brand">clubnb</span>
				</NavLink>
				{/* <NavLink to="about">About</NavLink> */}
				<NavLink to="stay">Stays</NavLink>
				{/* <NavLink to="chat">Chat</NavLink> */}
				<NavLink to="messages">Messages</NavLink>

				{user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

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
				{/* {!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
				{user && (
					<div className="user-info">
						<Link to={`user/${user._id}`}>
							{user.imgUrl && <img src={user.imgUrl} />}
							{user.fullname}
						</Link>
						<button onClick={onLogout}>logout</button>
					</div>
				)} */}
			</nav>

			<div className="expanded-header-search">
				<SearchBar initialModal={initialModal} />
			</div>

		</header>
	)
}
