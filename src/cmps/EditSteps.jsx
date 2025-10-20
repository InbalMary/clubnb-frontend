import { useState } from "react"
import { ImgUploader } from "./ImgUploader"

export function WelcomeStep({ onNext }) {
    return (
        <>
            <main className="welcome-screen step-container">
                <div className="welcome-content">
                    <div className="welcome-left">
                        <h1 className="welcome-title step-title">
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
                                            Add 5 or more photos plus a title and description- we'll help you out.
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

            <footer className="welcome-footer step-footer">
                <button className="btn btn-pink get-started-button" onClick={onNext}>
                    Get started
                </button>
            </footer>
        </>
    )
}

export function StepIntro() {
    return (
        <main className="step-main-content step-container">
            <div className="step-left">
                <div className="step-label">Step 1</div>
                <h1 className="step-main-title step-title">Tell us about your place</h1>
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
        <main className="step-selection-content step-container">
            <h1 className="selection-title step-title">
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
        <main className="step-selection-content step-container">
            <h1 className="selection-title step-title">
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
        <div className="step-address-form-container step-container">
            <div className="address-form-content">
                <h1 className="address-form-title step-title">Confirm your address</h1>
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

export function StepBasics({ guests, setGuests, bedrooms, setBedrooms, beds, setBeds, bathrooms, setBathrooms }) {
    const items = [
        { field: 'guests', label: 'Guests', value: guests, setter: setGuests, min: 1 },
        { field: 'bedrooms', label: 'Bedrooms', value: bedrooms, setter: setBedrooms, min: 0 },
        { field: 'beds', label: 'Beds', value: beds, setter: setBeds, min: 1 },
        { field: 'bathrooms', label: 'Bathrooms', value: bathrooms, setter: setBathrooms, min: 1 }
    ]

    const handleIncrement = (item) => {
        item.setter(item.value + 1)
    }

    const handleDecrement = (item) => {
        if (item.value > item.min) {
            item.setter(item.value - 1)
        }
    }

    return (
        <main className="step-basics-content step-container">
            <div className="basics-header">
                <h1 className="basics-title step-title">Share some basics about your place</h1>
                <p className="basics-subtitle">
                    You'll add more details later, like bed types.
                </p>
            </div>

            <div className="basics-list">
                {items.map(item => (
                    <div key={item.field} className="basics-item">
                        <span className="basics-label">{item.label}</span>
                        <div className="basics-counter">
                            <button
                                className={`counter-btn ${item.value <= item.min ? 'disabled' : ''}`}
                                onClick={() => handleDecrement(item)}
                                disabled={item.value <= item.min}
                            >
                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}>
                                    <path d="m2 16h28"></path>
                                </svg>
                            </button>
                            <span className="counter-value">{item.value}</span>
                            <button
                                className="counter-btn"
                                onClick={() => handleIncrement(item)}
                            >
                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}>
                                    <path d="m2 16h28m-14-14v28"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export function StepStandOutIntro() {
    return (
        <main className="step-intro-content step-container">
            <div className="intro-text-section">
                <div className="intro-step-label">Step 2</div>
                <h1 className="intro-title step-title">Make your place stand out</h1>
                <p className="intro-description">
                    In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then, you'll create a title and description.
                </p>
            </div>

            <div className="intro-media-section">
                <video
                    className="intro-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/img/video/step2-intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </main>
    )
}

export function StepAmenities({ amenities, setAmenities }) {
    const guestFavorites = [
        { id: 'essentials-wifi', label: 'Wifi' },
        { id: 'essentials-tv', label: 'TV' },
        { id: 'kitchen', label: 'Kitchen' },
        { id: 'appliances-washer', label: 'Washer' },
        { id: 'parking-free', label: 'Free parking on premises' },
        { id: 'parking-paid', label: 'Paid parking on premises' },
        { id: 'heating-airConditioning', label: 'Air conditioning' },
        { id: 'workspace-dedicated', label: 'Dedicated workspace' }
    ]

    const toggleAmenity = (amenityId) => {
        setAmenities(prev => {
            if (prev.includes(amenityId)) {
                return prev.filter(id => id !== amenityId)
            } else {
                return [...prev, amenityId]
            }
        })
    }

    return (
        <main className="step-selection-content step-selection-grid step-container">
            <div className="selection-header-wrapper">
                <h1 className="selection-title step-title">
                    Tell guests what your place has to offer
                </h1>
                <p className="selection-subtitle">
                    You can add more amenities after you publish your listing.
                </p>
                <h2 className="selection-section-title">What about these guest favorites?</h2>
            </div>
            
            <div className="place-types-grid">
                {guestFavorites.map(amenity => (
                    <button
                        key={amenity.id}
                        className={`place-type-card ${amenities.includes(amenity.id) ? 'selected' : ''}`}
                        onClick={() => toggleAmenity(amenity.id)}
                    >
                        <span className="place-icon">
                            <img
                                src={`/img/stepAmenities/${amenity.id}.svg`}
                                alt={amenity.id}
                                className="step2-icon"
                            />
                        </span>
                        <span className="place-label">{amenity.label}</span>
                    </button>
                ))}
            </div>
        </main>
    )
}


export function StepPhoto({ photos, setPhotos }) {
  const [uploadedImages, setUploadedImages] = useState(photos || [])

  const handleImageUpload = (imgUrl) => {
    const newImages = [...uploadedImages, imgUrl]
    setUploadedImages(newImages)
    setPhotos(newImages)
  }

  return (
    <div className="step-photo-container step-container">
      <div className="step-photo-content">
        <h1 className="step-photo-title step-title">Add some photos of your apartment</h1>
        <p className="step-photo-subtitle">
          You'll need 5 photos to get started. You can add more or make changes later.
        </p>

        <div className="photo-upload-area">
          <div className="camera-icon-container">
            <img src="/img/camera.png" alt="camera" className="camera-icon" />
          </div>
          
          <ImgUploader onUploaded={handleImageUpload} />
          
          {uploadedImages.length > 0 && (
            <div className="uploaded-images-preview">
              {uploadedImages.map((img, idx) => (
                <img key={idx} src={img} alt={`uploaded ${idx}`} className="preview-image" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function StepTitle({ title, setTitle }) {
  const [charCount, setCharCount] = useState(title?.length || 0)
  const maxChars = 50

  const handleTitleChange = (e) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setTitle(value)
      setCharCount(value.length)
    }
  }

  return (
    <div className="step-title-container step-container">
      <div className="step-title-content">
        <h1 className="step-title-heading step-title">Now, let's give your apartment a title</h1>
        <p className="step-title-subtitle">
          Short titles work best. Have fun with it—you can always change it later.
        </p>

        <div className="title-input-wrapper">
          <textarea
            className="title-textarea"
            value={title || ''}
            onChange={handleTitleChange}
            placeholder=""
            maxLength={maxChars}
          />
          <div className="char-counter">
            {charCount}/{maxChars}
          </div>
        </div>
      </div>
    </div>
  )
}