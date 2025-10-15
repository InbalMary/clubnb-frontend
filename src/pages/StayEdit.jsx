import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { ImgUploader } from "../cmps/ImgUploader";
import { DateRangePicker } from "../cmps/DateRangePicker";

export function StayEdit() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedPlaceType, setSelectedPlaceType] = useState('')

    const placeTypes = [
        { id: 'house', label: 'House' },
        { id: 'apartment', label: 'Apartment' },
        { id: 'barn', label: 'Barn' },
        { id: 'bed-breakfast', label: 'Bed & breakfast' },
        { id: 'boat', label: 'Boat' },
        { id: 'cabin', label: 'Cabin' },
        { id: 'camper-rv', label: 'Camper/RV' },
        { id: 'casa-particular', label: 'Casa particular' },
        { id: 'castle', label: 'Castle' },
        { id: 'cave', label: 'Cave' },
        { id: 'container', label: 'Container', },
        { id: 'cycladic-home', label: 'Cycladic home', }
    ]

    const handleSaveExit = () => {
        navigate('/')
    }

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2)
        } else if (currentStep === 2 && selectedPlaceType) {
            console.log('Moving to step 3, selected:', selectedPlaceType)
            // setCurrentStep(3);
        }
    }

    const handleBack = () => {
        if (currentStep === 1) {
            navigate('/')
        } else {
            setCurrentStep(currentStep - 1)
        }
    }

    const handlePlaceTypeSelect = (placeId) => {
        setSelectedPlaceType(placeId)
    }

    return (
        <div className="edit-container">
            <header className="edit-header">
                <div className="logo-black-container">
                    <img src={`/img/logo-black.svg`} alt="logo-black" className="logo-black-icon" />
                </div>
                <div className="header-actions">
                    <button className="btn btn-pill questions-button">Questions?</button>
                    <button className="btn btn-pill save-exit-button" onClick={handleSaveExit}>
                        Save & exit
                    </button>
                </div>
            </header>

            {currentStep === 1 && (
                <>
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
                </>
            )}

            {currentStep === 2 && (
                <main className="step-selection-content">
                    <h1 className="selection-title">Which of these best describes your place?</h1>
                    <div className="place-types-grid">
                        {placeTypes.map(place => (
                            <button
                                key={place.id}
                                className={`place-type-card ${selectedPlaceType === place.id ? 'selected' : ''}`}
                                onClick={() => handlePlaceTypeSelect(place.id)}
                            >
                                <span className="place-icon"><img src={`/img/step2/${place.id}.svg`} alt={place.idn} className="step2-icon" /></span>
                                <span className="place-label">{place.label}</span>
                            </button>
                        ))}
                    </div>
                </main>
            )}

            <footer className="step-footer">
                <button className="back-button" onClick={handleBack}>
                    Back
                </button>
                <button
                    className={`btn btn-black next-button ${currentStep === 2 && !selectedPlaceType ? 'disabled' : ''}`}
                    onClick={handleNext}
                    disabled={currentStep === 2 && !selectedPlaceType}
                >
                    Next
                </button>
            </footer>
        </div>
    )
}