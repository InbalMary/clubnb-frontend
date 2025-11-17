import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

export function UserMsg() {
	const [msg, setMsg] = useState(null)
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(closeMsg, 3000)
		})

		socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
			showSuccessMsg(`New review about me ${review.txt}`)
		})

		return () => {
			unsubscribe()
			socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
		}
	}, [])

	function closeMsg() {
		setMsg(null)
	}

	function msgClass() {
		return msg ? 'visible' : ''
	}

	if (!msg) return null

	return (
		<section className={`user-msg ${msg?.type} ${msgClass()}`}>
			<div className='msg-main'>
				{msg?.imgUrl && (
					<div className="user-msg-img">
						<img src={msg.imgUrl} alt="stay preview" />
					</div>
				)}
				<div className='msg-text'>{msg?.txt}</div>
				{msg?.txt?.includes('Saved to wishlist') && (
					<button className='user-msg-action' onClick={() => console.log('TODO later: open user wishlist select')}>
						Change</button>
					// <button onClick={closeMsg}>x</button>
				)}
			</div>


		</section>
	)
}
