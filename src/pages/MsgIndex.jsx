import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { stayService } from '../services/stay'
import { ConversationList } from '../cmps/ConversationList'
import { StayChat } from './StayChat'

export function MsgIndex() {
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [selectedStay, setSelectedStay] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showChat, setShowChat] = useState(false)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        loadConversations()
    }, [loggedInUser])

    async function loadConversations() {
        if (!loggedInUser) {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            const userConversations = await stayService.getUserConversations(loggedInUser._id)
            setConversations(userConversations)
        } catch (err) {
            console.error('Failed to load conversations', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConversationClick = async (conversation) => {
        setSelectedConversation(conversation)

        if (!conversation.stay) {
            try {
                const stay = await stayService.getById(conversation.stayId)
                setSelectedStay(stay)
            } catch (err) {
                console.error('Failed to load stay', err)
            }
        } else {
            setSelectedStay(conversation.stay)
        }

        setShowChat(true)
    }

    const handleCloseChat = () => {
        setShowChat(false)
    }

    if (!loggedInUser) {
        return (
            <div className="msg-index">
                <div className="empty-state">
                    <p>Please log in to view your messages</p>
                </div>
            </div>
        )
    }

    return (
        <div className="msg-index">

            <div className="messages-header-wrapper">
                <div className="messages-page-header">
                    <h1>Messages</h1>
                </div>
            </div>

            <div className="msg-layout">
                {/* Left: Conversations List */}
                <div className={`conversations-sidebar ${showChat ? 'hide-mobile' : ''}`}>
                    <div className="conversations-header">
                        <h2>Messages</h2>
                        {conversations.length > 0 && (
                            <span className="conversation-count">
                                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="loading-state">Loading conversations...</div>
                    ) : conversations.length === 0 ? (
                        <div className="empty-conversations">
                            <p>No messages yet</p>
                            <p className="subtitle">Start a conversation by messaging a host!</p>
                        </div>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedConversation={selectedConversation}
                            onConversationClick={handleConversationClick}
                        />
                    )}
                </div>

                {/* Right: Chat Window */}
                <div className={`chat-area ${!showChat ? 'hide-mobile' : ''}`}>
                    {selectedConversation && selectedStay ? (
                        <StayChat
                            stay={selectedStay}
                            guestId={selectedConversation.partnerId}
                            onClose={handleCloseChat}
                        />
                    ) : (
                        <div className="no-conversation-selected">
                            <div className="placeholder-content">
                                <h3>Select a conversation</h3>
                                <p>Choose a conversation from the list to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}