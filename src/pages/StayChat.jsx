import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { debounce } from '../services/util.service.js'
import { addStayMsg, loadStayMsgs } from '../store/actions/stay.actions'
import { store } from '../store/store.js'
import {
    socketService,
    SOCKET_EMIT_STAY_SET_TOPIC,
    SOCKET_EMIT_STAY_SEND_MSG,
    SOCKET_EVENT_STAY_ADD_MSG,
    SOCKET_EMIT_STAY_TYPING,
    SOCKET_EVENT_STAY_USER_TYPING
} from '../services/socket.service'

export function StayChat({ stay, guestId, onClose }) {
    const [msg, setMsg] = useState({ txt: '' })
    const [typingUsers, setTypingUsers] = useState([])
    const [filteredMsgs, setFilteredMsgs] = useState([])

    const msgsRef = useRef()
    const user = useSelector(storeState => storeState.userModule.user)
    const stayMsgs = useSelector(storeState => storeState.stayModule.stayMsgs)
    const currentUserName = user ? user.fullname : 'Guest'

    const effectiveGuestId = guestId || stay?.host?._id
    const isHost = stay?.host?._id === user?._id

    const debouncedStopTyping = useRef(
        debounce(() => {
            socketService.emit(SOCKET_EMIT_STAY_TYPING, {
                stayId: stay?._id,
                userName: currentUserName,
                isTyping: false
            })
        }, 1000)
    ).current

    useEffect(() => {
        if (stay?._id) {
            loadStayMsgs(stay._id)
            socketService.emit(SOCKET_EMIT_STAY_SET_TOPIC, {
                stayId: stay._id,
                userName: currentUserName
            })
        }
    }, [stay?._id, currentUserName])

    useEffect(() => {
        if (!effectiveGuestId || !user) {
            setFilteredMsgs(stayMsgs)
            return
        }

        const filtered = stayMsgs.filter(m => {
            const hasTo = m.to && m.to._id
            if (hasTo) {
                return (
                    (m.from._id === user._id && m.to._id === effectiveGuestId) ||
                    (m.from._id === effectiveGuestId && m.to._id === user._id)
                )
            }

            return m.from._id === user._id || m.from._id === effectiveGuestId
        })

        setFilteredMsgs(filtered)
    }, [stayMsgs, effectiveGuestId, user])

    // Scroll to bottom
    useEffect(() => {
        if (msgsRef.current) {
            msgsRef.current.scrollTo({
                top: msgsRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [filteredMsgs])

    // Socket listeners
    useEffect(() => {
        socketService.on(SOCKET_EVENT_STAY_ADD_MSG, handleSocketMsg)
        socketService.on(SOCKET_EVENT_STAY_USER_TYPING, handleTypingEvent)
        return () => {
            socketService.off(SOCKET_EVENT_STAY_ADD_MSG, handleSocketMsg)
            socketService.off(SOCKET_EVENT_STAY_USER_TYPING, handleTypingEvent)
        }
    }, [])

    function handleSocketMsg(newMsg) {
        store.dispatch({ type: 'ADD_STAY_MSG', msg: newMsg })
    }

    function handleTypingEvent({ userName, isTyping }) {
        setTypingUsers(prev => {
            if (isTyping) {
                if (!prev.includes(userName) && userName !== currentUserName) {
                    return [...prev, userName]
                }
                return prev
            } else {
                return prev.filter(name => name !== userName)
            }
        })
    }

    const sendMsg = async (ev) => {
        ev.preventDefault()
        if (!msg.txt.trim()) return

        try {
            const inputText = msg.txt.trim()
            const newMsg = await addStayMsg(stay._id, inputText, effectiveGuestId)

            socketService.emit(SOCKET_EMIT_STAY_SEND_MSG, {
                stayId: stay._id,
                msg: newMsg
            })

            setMsg({ txt: '' })
            socketService.emit(SOCKET_EMIT_STAY_TYPING, {
                stayId: stay._id,
                userName: currentUserName,
                isTyping: false
            })
        } catch (err) {
            console.error('Failed to send message', err)
        }
    }

    const handleFormChange = (ev) => {
        const { name, value } = ev.target
        setMsg(prevMsg => ({ ...prevMsg, [name]: value }))

        socketService.emit(SOCKET_EMIT_STAY_TYPING, {
            stayId: stay._id,
            userName: currentUserName,
            isTyping: true
        })

        debouncedStopTyping()
    }

    const handleKey = (ev) => {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            sendMsg(ev)
        }
    }

    const getDisplayName = (msgFrom) => {
        if (!msgFrom) return 'Guest'
        if (msgFrom._id === user?._id) return 'Me'
        return msgFrom.fullname || 'Guest'
    }

    const getUserImage = (userObj) => {
        return userObj?.imgUrl || userObj?.pictureUrl || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    }

    const getPartner = () => {
        if (!effectiveGuestId) return stay.host

        if (isHost) {
            const guestMsg = filteredMsgs.find(m =>
                m.from._id === effectiveGuestId || m.to?._id === effectiveGuestId
            )

            if (guestMsg) {
                return guestMsg.from._id === effectiveGuestId ? guestMsg.from : guestMsg.to
            }

            return {
                _id: effectiveGuestId,
                fullname: 'Guest',
                imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
            }
        } else {
            return stay.host
        }
    }

    const partner = getPartner()

    return (
        <div className="stay-chat-container">
            <div className="chat-header">
                <div className="chat-header-info">
                    <img
                        src={getUserImage(partner)}
                        alt={partner?.firstName || partner?.fullname}
                        className="host-avatar-small"
                    />
                    <div>
                        <h3>Chat with {partner?.fullname || partner?.firstName || 'User'}</h3>
                        <p className="stay-name">{stay?.name}</p>
                    </div>
                </div>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>✕</button>
                )}
            </div>

            <div ref={msgsRef} className="chat-messages">
                {filteredMsgs.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    filteredMsgs.map((m, idx) => (
                        <div
                            key={m.id ? `${m.id}-${idx}` : `msg-${idx}`}
                            className={`message ${m.from?._id === user?._id ? 'user' : 'other'}`}
                        >
                            <div className="message-header">
                                <img
                                    src={getUserImage(m.from)}
                                    alt={m.from?.fullname || 'User'}
                                    className="msg-avatar"
                                />
                                <div className="message-info">
                                    <h4>{getDisplayName(m.from)}</h4>
                                    <span className="timestamp">
                                        {new Date(m.timestamp).toLocaleTimeString('he-IL', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <p className="message-text">{m.txt}</p>
                        </div>
                    ))
                )}

                {typingUsers.length > 0 && (
                    <div className="typing-indicator">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…
                    </div>
                )}
            </div>

            <form onSubmit={sendMsg} className="chat-input-form">
                <input
                    type="text"
                    value={msg.txt}
                    onChange={handleFormChange}
                    onKeyDown={handleKey}
                    name="txt"
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <button type="submit" disabled={!msg.txt.trim()}>Send</button>
            </form>
        </div>
    )
}