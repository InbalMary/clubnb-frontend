import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'
import { NavLink } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu';

export function AppFooter({ isIndexPage, isStayDetailsPage }) {
	const user = useSelector(storeState => storeState.userModule.user)
	const showDesktopHeader = isIndexPage || isStayDetailsPage;
	const to = user?.stays?.length > 0 ? '/hosting' : '/become-a-host';
	const text = user?.stays?.length > 0 ? 'Switch to hosting' : 'Become a host';

	return (
		<footer className="app-footer full">
			{showDesktopHeader ? (
				<>
					<NavLink to="/" className="logo-header">
						<span className="icon">{appHeaderSvg.logo}</span>
					</NavLink>

					<div className="header-actions">
						{/* <NavLink to={user ? to : "/auth/login"}>
							<span className="host-link">{user ? text : "Become a host"}</span>
						</NavLink>						 */}
						<HamburgerMenu />
					</div>
				</>
			) : (
				<>
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
				</>
			)}
			{/* {import.meta.env.VITE_LOCAL ?
				<span className="local-services">Local Services</span> :
				<span className="remote-services">Remote Services</span>} */}
		</footer>
	)
}