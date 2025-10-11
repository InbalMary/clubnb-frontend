import { svgControls } from "./Svgs"

export function DateSelector({ label, date, isActive, onClick, onClear, placeholder = "Add dates" }) {
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
            {date && (
                <button
                    className="search close-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering onClick from the wrapper
                        onClear?.(); // safely call onClear if provided
                    }}
                    aria-label="Clear date"
                >
                    {svgControls.closeModal}
                </button>)}
        </div>
    )
}

export function StickyDateSelector({ label, isHeader = true, date, isActive, onClick, onClear, placeholder = "Add dates" }) {
    const formatDate = (date) => {
        if (!date) return null
        if (isHeader) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
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
            {date && (
                <button
                    className="search close-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering onClick from the wrapper
                        onClear?.(); // safely call onClear if provided
                    }}
                    aria-label="Clear date"
                >
                    {svgControls.closeModal}
                </button>)}
        </div>
    )
}