import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { ImgUploader } from "../cmps/ImgUploader";
import { DateRangePicker } from "../cmps/DateRangePicker";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { StepLocation } from "../cmps/StepLocation";

import { WelcomeStep, StepIntro, PlaceTypeStep, PrivacyTypeStep } from '../cmps/EditSteps.jsx'

export function StayEdit() {
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()

    const [currentStep, setCurrentStep] = useState(0)
    const [stayId, setStayId] = useState(id || null)
    const [selectedPlaceType, setSelectedPlaceType] = useState('')
    const [selectedPrivacyType, setSelectedPrivacyType] = useState('')
    const [address, setAddress] = useState('')
    const [locationData, setLocationData] = useState({ lat: 32.0853, lng: 34.7818 }) // Default to Tel Aviv

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
        { id: 'container', label: 'Container' },
        { id: 'cycladic-home', label: 'Cycladic home' }
    ]

    const privacyTypes = [
        {
            id: 'entire-place',
            label: 'An entire place',
            description: 'Guests have the whole place to themselves.',
        },
        {
            id: 'room',
            label: 'A room',
            description: 'Guests have their own room in a home, plus access to shared spaces.',
        },
        {
            id: 'shared-room',
            label: 'A shared room in a hostel',
            description: 'Guests sleep in a shared room in a professionally managed hostel with staff onsite 24/7.',
        }
    ]

    useEffect(() => {
        if (location.pathname.includes('become-a-host')) setCurrentStep(0)
        else if (location.pathname.includes('about-your-place')) setCurrentStep(1)
        else if (location.pathname.includes('structure')) setCurrentStep(2)
        else if (location.pathname.includes('privacy-type')) setCurrentStep(3)
        else if (location.pathname.includes('location')) setCurrentStep(4)
    }, [location.pathname])

    const handleNext = async () => {
        try {
            if (currentStep === 0 && !stayId) {
                const newStay = await stayService.save({ title: '', type: '', address: '', location: {} })
                setStayId(newStay._id)
                navigate(`/edit/${newStay._id}/about-your-place`)
                return
            }

            if (currentStep === 1) navigate(`/edit/${stayId}/structure`)
            if (currentStep === 2) navigate(`/edit/${stayId}/privacy-type`)
            if (currentStep === 3) navigate(`/edit/${stayId}/location`)
            if (currentStep === 4) showSuccessMsg('Stay setup complete!')
        } catch (err) {
            console.error('Error navigating next:', err)
            showErrorMsg('Could not save progress')
        }
    }

    const handleBack = () => {
        if (currentStep === 0) navigate('/hosting')
        if (currentStep === 1) navigate('/edit/become-a-host')
        if (currentStep === 2) navigate(`/edit/${stayId}/about-your-place`)
        if (currentStep === 3) navigate(`/edit/${stayId}/structure`)
        if (currentStep === 4) navigate(`/edit/${stayId}/privacy-type`)
    }

    const handleSaveExit = () => {
        showSuccessMsg('Progress saved')
        navigate('/hosting/listings')
    }

    const handlePlaceTypeSelect = (placeId) => setSelectedPlaceType(placeId)
    const handlePrivacyTypeSelect = (privacyId) => setSelectedPrivacyType(privacyId)

    const isNextDisabled = () => {
        if (currentStep === 2 && !selectedPlaceType) return true
        if (currentStep === 3 && !selectedPrivacyType) return true
        if (currentStep === 4 && !address) return true
        return false
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <WelcomeStep onNext={handleNext} />
            case 1:
                return <StepIntro />
            case 2:
                return (
                    <PlaceTypeStep
                        placeTypes={placeTypes}
                        selectedPlaceType={selectedPlaceType}
                        onSelect={handlePlaceTypeSelect}
                    />
                )
            case 3:
                return (
                    <PrivacyTypeStep
                        privacyTypes={privacyTypes}
                        selectedPrivacyType={selectedPrivacyType}
                        onSelect={handlePrivacyTypeSelect}
                    />
                )
            case 4:
                return (
                    <StepLocation
                        address={address}
                        setAddress={setAddress}
                        location={locationData}
                        setLocation={setLocationData}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="edit-container">
            <header className="edit-header">
                <div className="logo-black-container">
                    <img src="/img/logo-black.svg" alt="logo" className="logo-black-icon" />
                </div>
                <div className="header-actions">
                    {currentStep === 0 ? (
                        <button className="btn btn-pill save-exit-button" onClick={handleSaveExit}>
                            Exit
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-pill questions-button">Questions?</button>
                            <button className="btn btn-pill save-exit-button" onClick={handleSaveExit}>
                                Save & exit
                            </button>
                        </>
                    )}
                </div>
            </header>

            {renderStepContent()}

            {currentStep > 0 && (
                <footer className="step-footer">
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                    <button
                        className={`btn btn-black next-button ${isNextDisabled() ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                    >
                        Next
                    </button>
                </footer>
            )}
        </div>
    )
}