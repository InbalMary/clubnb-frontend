export function ConversationPreview({ conversation, onClick }) {
    const {
        stayName,
        stayImgUrl,
        partnerName,
        partnerImgUrl,
        lastMessage,
        unreadCount
    } = conversation

    // Format timestamp
    function formatTime(timestamp) {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    // Truncate message preview
    function truncateText(text, maxLength = 60) {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <article className="conversation-preview" onClick={onClick}>
            <div className="conversation-images">
                <img
                    src={stayImgUrl}
                    alt={stayName}
                    className="stay-thumbnail"
                />
                <img
                    src={partnerImgUrl}
                    alt={partnerName}
                    className="partner-avatar"
                />
            </div>

            <div className="conversation-details">
                <div className="conversation-header">
                    <h3 className="stay-name">{stayName}</h3>
                    <span className="timestamp">{formatTime(lastMessage.timestamp)}</span>
                </div>

                <div className="conversation-body">
                    <p className="partner-name">{partnerName}</p>
                    <p className={`last-message ${unreadCount > 0 ? 'unread' : ''}`}>
                        {lastMessage.fromMe && <span className="me-indicator">You: </span>}
                        {truncateText(lastMessage.txt)}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                )}
            </div>
        </article>
    )
}