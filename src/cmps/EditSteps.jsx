export function WelcomeStep({ onNext }) {
    return (
        <>
            <main className="welcome-screen">
                <div className="welcome-content">
                    <div className="welcome-left">
                        <h1 className="welcome-title">
                            It's easy to get started on Airbnb
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
