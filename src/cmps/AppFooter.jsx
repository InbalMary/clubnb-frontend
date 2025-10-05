import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'

export function AppFooter() { //TODO: accept language & currency props to update footer with user selection


	return (
		<footer className="app-footer full">
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
			{/* {import.meta.env.VITE_LOCAL ?
				<span className="local-services">Local Services</span> :
				<span className="remote-services">Remote Services</span>} */}
		</footer>
	)
}