export function DateSelector({ label, date, isActive, onClick, placeholder = "Add dates" }) {
    const formatDate = (date) => {
        if (!date) return null
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div
            className={`search-section search-section-date ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="search-label">{label}</div>
            <div className={`search-placeholder ${date ? 'has-value' : ''}`}>
                {date ? formatDate(date) : placeholder}
            </div>
        </div>
    )
}