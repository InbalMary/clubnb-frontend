import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { debounce } from '../services/util.service.js'
import { addStayMsg, removeStayMsg } from '../store/actions/stay.actions'
import { store } from '../store/store.js'
import { 
    socketService, 
    SOCKET_EMIT_STAY_SET_TOPIC, 
    SOCKET_EMIT_STAY_SEND_MSG,
    SOCKET_EVENT_STAY_ADD_MSG,
    SOCKET_EMIT_STAY_TYPING,
    SOCKET_EVENT_STAY_USER_TYPING
} from '../services/socket.service'

export function StayChat({ stay, onClose }) {
    const [msg, setMsg] = useState({ txt: '' })
    const [typingUsers, setTypingUsers] = useState([])

    const msgsRef = useRef()
    const { stayId } = useParams()

    const user = useSelector(storeState => storeState.userModule.user)
    const stayMsgs = useSelector(storeState => storeState.stayModule.stayMsgs)
    const currentUserName = user ? user.fullname : 'Guest'

    const debouncedStopTyping = useRef(
        debounce(() => {
            socketService.emit(SOCKET_EMIT_STAY_TYPING, { 
                stayId, 
                userName: currentUserName, 
                isTyping: false 
            })
        }, 1000)
    ).current

    useEffect(() => {
        if (msgsRef.current) {
            msgsRef.current.scrollTo({
                top: msgsRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [stayMsgs])

    useEffect(() => {
        socketService.on(SOCKET_EVENT_STAY_ADD_MSG, handleSocketMsg)
        socketService.on(SOCKET_EVENT_STAY_USER_TYPING, handleTypingEvent)

        return () => {
            socketService.off(SOCKET_EVENT_STAY_ADD_MSG, handleSocketMsg)
            socketService.off(SOCKET_EVENT_STAY_USER_TYPING, handleTypingEvent)
        }
    }, [])

    useEffect(() => {
        if (stayId) {
            socketService.emit(SOCKET_EMIT_STAY_SET_TOPIC, { 
                stayId, 
                userName: currentUserName 
            })
        }
    }, [stayId, currentUserName])

    function handleSocketMsg(newMsg) {
        // Dispatch to Redux store - the reducer will handle duplicates
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
            const newMsg = await addStayMsg(stayId, msg.txt)
            
            socketService.emit(SOCKET_EMIT_STAY_SEND_MSG, { 
                stayId, 
                msg: newMsg 
            })
            
            setMsg({ txt: '' })
            socketService.emit(SOCKET_EMIT_STAY_TYPING, { 
                stayId, 
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
            stayId, 
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
        console.log('userObj', userObj)
        return userObj?.imgUrl || userObj?.pictureUrl || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    }

    const isHost = stay?.host?._id === user?._id

    return (
        <div className="stay-chat-container">
            <div className="chat-header">
                <div className="chat-header-info">
                    <img 
                        src={getUserImage(stay?.host)} 
                        alt={stay?.host?.firstName || stay?.host?.fullname} 
                        className="host-avatar-small"
                    />
                    <div>
                        <h3>Chat with {isHost ? 'your guests' : stay?.host?.firstName || stay?.host?.fullname}</h3>
                        <p className="stay-name">{stay?.name}</p>
                    </div>
                </div>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>✕</button>
                )}
            </div>

            <div ref={msgsRef} className="chat-messages">
                {stayMsgs.map((m, idx) => (
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
                                <span className="timestamp">{new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                        <p className="message-text">{m.txt}</p>
                    </div>
                ))}

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