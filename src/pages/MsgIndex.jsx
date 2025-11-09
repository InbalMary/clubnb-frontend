import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMsgs, removeMsg, getActionAddMsg, getActionRemoveMsg } from '../store/actions/msg.actions'
import { loadUsers } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_REVIEW_ADDED, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service'
import { MsgList } from '../cmps/MsgList'
import { MsgEdit } from '../cmps/MsgEdit'
import { ChatApp } from './Chat'

export function MsgIndex() {
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const msgs = useSelector(storeState => storeState.msgModule?.msgs || [])

    const dispatch = useDispatch()

    useEffect(() => {
        loadMsgs()
        loadUsers()

        socketService.on(SOCKET_EVENT_REVIEW_ADDED, msg => {
            console.log('GOT from socket', msg)
            dispatch(getActionAddMsg(msg))
        })

        socketService.on(SOCKET_EVENT_REVIEW_REMOVED, msgId => {
            console.log('GOT from socket', msgId)
            dispatch(getActionRemoveMsg(msgId))
        })

        return () => {
            socketService.off(SOCKET_EVENT_REVIEW_ADDED)
            socketService.off(SOCKET_EVENT_REVIEW_REMOVED)
        }
    }, [])

    async function onRemoveMsg(msgId) {
        try {
            await removeMsg(msgId)
            showSuccessMsg('Msg removed')
        } catch (err) {
            showErrorMsg('Cannot remove')
        }
    }

    return <div className="msg-index">
        <h2>Msgs </h2>
        {/* {loggedInUser && <MsgEdit />} */}
        <section className="flex justify-evenly">
            <div className="inbox-list">
                <span>inbox column list</span>
                <MsgList
                    msgs={msgs}
                    onRemoveMsg={onRemoveMsg} />
            </div>
            <div className="chat">
                <span>Chat</span>
                <ChatApp/>
                </div>
            <div className="mini-order-details">mini order details</div>
        </section>
    </div>
}