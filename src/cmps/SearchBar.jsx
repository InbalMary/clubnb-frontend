import { useState } from "react";
import { appHeaderSvg } from "./Svgs";

export function SearchBar() {
    const [activeModal, setActiveModal] = useState(null);


    return (
        <div className="search-bar-wrapper">
            <div className="search-item-container">
                <div className="search-section search-section-where"
                    onClick={() => setActiveModal('where')}>
                    <div className="search-label">Where</div>
                    <input className="search-input"
                        type="text"
                        placeholder="Search destinations"
                    />
                </div>

                <div className="search-divider"></div>

                <div className="search-section search-section-date"
                    onClick={() => setActiveModal('checkin')}>
                    <div className="search-label">Check in</div>
                    <div className="search-placeholder">Add dates</div>
                </div>

                <div className="search-divider"></div>

                <div className="search-section search-section-date"
                    onClick={() => setActiveModal('checkout')} >
                    <div className="search-label">Check out</div>
                    <div className="search-placeholder">Add dates</div>
                </div>

                <div className="search-divider"></div>

                <div className="search-section search-section-who"
                    onClick={() => setActiveModal('who')} >
                    <div className="search-content">
                        <div className="search-label">Who</div>
                        <div className="search-placeholder">Add guests</div>
                    </div>

                    <button className="search-button">
                        <span>{appHeaderSvg.search}</span>
                    </button>
                </div>
            </div>

            {/* Modal placeholder */}
            {activeModal && (
                <div className="modal-overlay"
                    onClick={() => setActiveModal(null)} >
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">
                            {activeModal === 'where' && 'Where to?'}
                            {activeModal === 'checkin' && 'Check in'}
                            {activeModal === 'checkout' && 'Check out'}
                            {activeModal === 'who' && 'Who\'s coming?'}
                        </h3>
                        <p className="modal-text">Modal content will be here...</p>
                    </div>
                </div>
            )}
        </div>
    )
}