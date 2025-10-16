export function WelcomeStep({ onNext }) {
    return (
        <>
            <main className="welcome-screen">
                <div className="welcome-content">
                    <div className="welcome-left">
                        <h1 className="welcome-title">
                            It's easy to get started on Clubnb
                        </h1>
                    </div>

                    <div className="welcome-right">
                        <div className="welcome-steps">
                            <div className="welcome-step">
                                <div className="step-info">
                                    <div className="step-number">1</div>
                                    <div className="step-text">
                                        <h3>Tell us about your place</h3>
                                        <p>
                                            Share some basic info, like where it is and how many guests can stay.
                                        </p>
                                    </div>
                                </div>
                                <div className="step-illustration">
                                    <img src="/img/step2/your-place.png" alt="Step 1" />
                                </div>
                            </div>

                            <div className="welcome-step">
                                <div className="step-info">
                                    <div className="step-number">2</div>
                                    <div className="step-text">
                                        <h3>Make it stand out</h3>
                                        <p>
                                            Add 5 or more photos plus a title and description—we'll help you out.
                                        </p>
                                    </div>
                                </div>
                                <div className="step-illustration">
                                    <img src="/img/step2/stand-out.png" alt="Step 2" />
                                </div>
                            </div>

                            <div className="welcome-step">
                                <div className="step-info">
                                    <div className="step-number">3</div>
                                    <div className="step-text">
                                        <h3>Finish up and publish</h3>
                                        <p>
                                            Choose a starting price, verify a few details, then publish your listing.
                                        </p>
                                    </div>
                                </div>
                                <div className="step-illustration">
                                    <img src="/img/step2/finish-up.png" alt="Step 3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="welcome-footer">
                <button className="btn btn-pink get-started-button" onClick={onNext}>
                    Get started
                </button>
            </footer>
        </>
    )
}

export function StepIntro() {
    return (
        <main className="step-main-content">
            <div className="step-left">
                <div className="step-label">Step 1</div>
                <h1 className="step-main-title">Tell us about your place</h1>
                <p className="step-main-description">
                    In this step, we'll ask you which type of property you have and if
                    guests will book the entire place or just a room. Then let us know
                    the location and how many guests can stay.
                </p>
            </div>

            <div className="step-right">
                <video
                    className="step-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/img/video/listing-step1-animation.mp4" type="video/mp4" />
                </video>
            </div>
        </main>
    )
}

export function PlaceTypeStep({ placeTypes, selectedPlaceType, onSelect }) {
    return (
        <main className="step-selection-content">
            <h1 className="selection-title">
                Which of these best describes your place?
            </h1>
            <div className="place-types-grid">
                {placeTypes.map(place => (
                    <button
                        key={place.id}
                        className={`place-type-card ${selectedPlaceType === place.id ? 'selected' : ''}`}
                        onClick={() => onSelect(place.id)}
                    >
                        <span className="place-icon">
                            <img
                                src={`/img/step2/${place.id}.svg`}
                                alt={place.id}
                                className="step2-icon"
                            />
                        </span>
                        <span className="place-label">{place.label}</span>
                    </button>
                ))}
            </div>
        </main>
    )
}

export function PrivacyTypeStep({ privacyTypes, selectedPrivacyType, onSelect }) {
    return (
        <main className="step-selection-content">
            <h1 className="selection-title">
                What type of place will guests have?
            </h1>
            <div className="privacy-types-list">
                {privacyTypes.map(privacy => (
                    <button
                        key={privacy.id}
                        className={`privacy-type-card ${selectedPrivacyType === privacy.id ? 'selected' : ''}`}
                        onClick={() => onSelect(privacy.id)}
                    >
                        <div className="privacy-content">
                            <h3 className="privacy-label">{privacy.label}</h3>
                            <p className="privacy-description">{privacy.description}</p>
                        </div>
                        <div className="privacy-icon">
                            <img
                                src={`/img/step3/${privacy.id}.svg`}
                                alt={privacy.label}
                                className="step3-icon"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </main>
    )
}

export function StepAddressForm({ loc, setLoc }) {
    const handleChange = (field, value) => {
        const updatedLoc = { ...loc, [field]: value }
        updatedLoc.address = buildFullAddress(updatedLoc)
        setLoc(updatedLoc)
    }

    const handleCountryChange = (value) => {
        const [country, countryCode] = value.split(' - ')
        const updatedLoc = { ...loc, country, countryCode }
        updatedLoc.address = buildFullAddress(updatedLoc)
        setLoc(updatedLoc)
    }

    const buildFullAddress = (locObj) => {
        const parts = [
            locObj.street,
            locObj.apt ? `Apt ${locObj.apt}` : '',
            locObj.city,
            locObj.country
        ].filter(Boolean)
        return parts.join(', ')
    }

    return (
        <div className="step-address-form-container">
            <div className="address-form-content">
                <h1 className="address-form-title">Confirm your address</h1>
                <p className="address-form-subtitle">
                    Your address is only shared with guests after they've made a reservation.
                </p>

                {/* Country / Region */}
                <div className="form-field country-field">
                    <label className="field-label">Country / region</label>
                    <select
                        className="form-select"
                        value={`${loc.country} - ${loc.countryCode}`}
                        onChange={(ev) => handleCountryChange(ev.target.value)}
                    >
                        <option value="Israel - IL">Israel - IL</option>
                        <option value="United States - US">United States - US</option>
                        <option value="United Kingdom - GB">United Kingdom - GB</option>
                        <option value="France - FR">France - FR</option>
                        <option value="Germany - DE">Germany - DE</option>
                        <option value="Spain - ES">Spain - ES</option>
                        <option value="Italy - IT">Italy - IT</option>
                    </select>
                </div>

                {/* Address fields */}
                <div className="address-form-fields">
                    <div className="form-field">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Street address"
                            value={loc.street || ''}
                            onChange={(ev) => handleChange('street', ev.target.value)}
                        />
                    </div>

                    {/* Entrance */}
                    <div className="form-field">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Entrance (if applicable)"
                            value={loc.entrance || ''}
                            onChange={(ev) => handleChange('entrance', ev.target.value)}
                        />
                    </div>

                    {/* Apt, house, etc. */}
                    <div className="form-field">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Apt, house, etc. (if applicable)"
                            value={loc.apt || ''}
                            onChange={(ev) => handleChange('apt', ev.target.value)}
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="form-field">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Postal code"
                            value={loc.postalCode || ''}
                            onChange={(ev) => handleChange('postalCode', ev.target.value)}
                        />
                    </div>

                    {/* City / Town */}
                    <div className="form-field">
                        <label className="field-label">City / town</label>
                        <input
                            type="text"
                            className="form-input city-input"
                            value={loc.city || ''}
                            onChange={(ev) => handleChange('city', ev.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}