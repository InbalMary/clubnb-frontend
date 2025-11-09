import { userService } from '../services/user/index.js'

import { MsgPreview } from './MsgPreview.jsx'

export function MsgList({ msgs, onRemoveMsg }) {
    
    function shouldShowActionBtns(msg) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return msg.byUser?._id === user._id
    }

    const msgList = Array.isArray(msgs) ? msgs : []

    if (msgList.length === 0) {
        return (
            <section>
                <p className="empty-state">No messages yet</p>
            </section>
        )
    }

    return (
        <section>
            <ul className="msg-list">
                {msgList.map(msg =>
                    <li key={msg._id}>
                        {shouldShowActionBtns(msg) && (
                            <div className="actions">
                                <button onClick={() => onRemoveMsg(msg._id)}>x</button>
                            </div>
                        )}                    
                        <MsgPreview msg={msg}/>
                    </li>
                )}
            </ul>
        </section>
    )
}