import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { StepLocation } from "../cmps/StepLocation"
import { WelcomeStep, StepIntro, PlaceTypeStep, PrivacyTypeStep, StepAddressForm } from '../cmps/EditSteps.jsx'
import { loadStay } from "../store/actions/stay.actions.js"
import { parseAddressToComponents } from "../cmps/parseAddressToComponents.jsx"

export function StayEdit() {
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()

    const [currentStep, setCurrentStep] = useState(0)
    const [stayId, setStayId] = useState(id || null)

    const [stayData, setStayData] = useState({})
    const [selectedPlaceType, setSelectedPlaceType] = useState('')
    const [selectedPrivacyType, setSelectedPrivacyType] = useState('')
    const [address, setAddress] = useState('')
    const [locationData, setLocationData] = useState({ lat: 32.0853, lng: 34.7818 }) // Default to Tel Aviv

    const [loc, setLoc] = useState({
        country: 'Israel',
        countryCode: 'IL',
        city: 'Tel Aviv-Yafo',
        street: '',
        entrance: '',
        apt: '',
        postalCode: '',
        address: 'Tel Aviv-Yafo, Israel',
        lat: 32.0853,
        lng: 34.7818
    })

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
        else if (location.pathname.includes('address-details')) setCurrentStep(5)
    }, [location.pathname])

    useEffect(() => {
        if (stayId) {
            loadStay(stayId)
                .then(() => {
                    const stayFromStore = stayService.getById(stayId)
                    setStayData(stayFromStore)
                    setSelectedPlaceType(stayFromStore.type || '')
                    setSelectedPrivacyType(stayFromStore.roomType || '')
                    setAddress(stayFromStore.address || '')
                    setLocationData(stayFromStore.location || { lat: 32.0853, lng: 34.7818 })

                    if (stayFromStore.loc) {
                        setLoc({
                            ...stayFromStore.loc,
                            address: stayFromStore.loc.address || stayFromStore.address || '',
                            lat: stayFromStore.loc.lat || stayFromStore.location?.lat || 32.0853,
                            lng: stayFromStore.loc.lng || stayFromStore.location?.lng || 34.7818
                        })
                    }
                })
                .catch(err => console.log('Cannot load stay', err))
        }
    }, [stayId])

    const handleNext = async () => {
        try {
            const fullAddress = loc.street
                ? `${loc.street}${loc.entrance ? `, Entrance ${loc.entrance}` : ''}${loc.apt ? `, Apt ${loc.apt}` : ''}, ${loc.city}${loc.postalCode ? `, ${loc.postalCode}` : ''}, ${loc.country}`
                : address || stayData.address || ''

            const updatedStay = {
                ...stayData,
                type: selectedPlaceType || stayData.type || '',
                roomType: selectedPrivacyType || stayData.roomType || '',
                address: fullAddress,
                location: { lat: locationData.lat || loc.lat, lng: locationData.lng || loc.lng },
                loc: {
                    ...loc,
                    address: fullAddress
                }
            }

            const savedStay = await stayService.save(stayId ? { ...updatedStay, _id: stayId } : updatedStay)
            setStayId(savedStay._id)
            setStayData(savedStay)

            const nextRoutes = [
                '/about-your-place',
                '/structure',
                '/privacy-type',
                '/location',
                '/address-details'
            ]
            if (currentStep < nextRoutes.length)
                navigate(`/stay/edit/${savedStay._id}${nextRoutes[currentStep]}`)
            else showSuccessMsg('Stay setup complete!')
        } catch (err) {
            console.error('Error navigating next:', err)
            showErrorMsg('Could not save progress')
        }
    }

    const handleBack = () => {
        if (currentStep === 0) navigate('/stay/hosting')
        if (currentStep === 1) navigate('/stay/edit/become-a-host')
        if (currentStep === 2) navigate(`/stay/edit/${stayId}/about-your-place`)
        if (currentStep === 3) navigate(`/stay/edit/${stayId}/structure`)
        if (currentStep === 4) navigate(`/stay/edit/${stayId}/privacy-type`)
        if (currentStep === 5) navigate(`/stay/edit/${stayId}/location`)

    }

    const handleSaveExit = async () => {
        try {
            await stayService.save({
                ...stayData,
                type: selectedPlaceType || stayData.type || '',
                roomType: selectedPrivacyType || stayData.roomType || '',
                address: address || stayData.address || '',
                location: locationData || stayData.location || {},
                loc: loc || stayData.loc || {}
            })
            showSuccessMsg('Progress saved')
            navigate('/hosting/listings')
        } catch {
            showErrorMsg('Could not save stay')
        }
    }

    const isNextDisabled = () => {
        if (currentStep === 2 && !selectedPlaceType) return true
        if (currentStep === 3 && !selectedPrivacyType) return true
        if (currentStep === 4 && !address) return true
        if (currentStep === 5 && (!loc.street || !loc.city)) return true
        return false
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <WelcomeStep onNext={handleNext} />
            case 1:
                return <StepIntro />
            case 2:
                return <PlaceTypeStep
                    placeTypes={placeTypes}
                    selectedPlaceType={selectedPlaceType}
                    onSelect={setSelectedPlaceType}
                />
            case 3:
                return <PrivacyTypeStep
                    privacyTypes={privacyTypes}
                    selectedPrivacyType={selectedPrivacyType}
                    onSelect={setSelectedPrivacyType}
                />
            case 4:
                return <StepLocation
                    address={address}
                    setAddress={setAddress}
                    location={locationData}
                    setLocation={setLocationData}
                    loc={loc}
                    setLoc={setLoc}
                />
            case 5:
                return <StepAddressForm
                    loc={loc}
                    setLoc={setLoc}
                />
            default: return null
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