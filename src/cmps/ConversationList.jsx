import { ConversationPreview } from './ConversationPreview'

export function ConversationList({ conversations, selectedConversation, onConversationClick }) {
console.log('conversations', conversations)
    return (
        <ul className="conversation-list">
            {conversations.map(conversation => (
                <li
                    key={`${conversation.stayId}-${conversation.partnerId}`}
                    className={selectedConversation?.stayId === conversation.stayId &&
                        selectedConversation?.partnerId === conversation.partnerId
                        ? 'selected' : ''}
                >
                    <ConversationPreview
                        conversation={conversation}
                        onClick={() => onConversationClick(conversation)}
                    />
                </li>
            ))}
        </ul>
    )
}