import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { StepLocation } from "../cmps/StepLocation"
import { WelcomeStep, StepIntro, PlaceTypeStep, PrivacyTypeStep, StepAddressForm, StepBasics, StepStandOutIntro, StepAmenities, StepPhoto, StepTitle, StepDescription, StepFinishIntro, StepPrice } from '../cmps/EditSteps.jsx'
import { loadStay } from "../store/actions/stay.actions.js"
import { StepMapConfirm } from "../cmps/StepMapConfirm.jsx"
import { useSelector } from "react-redux"

export function StayEdit() {
    const loggedInUser = useSelector((state) => state.userModule.user)
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

    const [guests, setGuests] = useState(4)
    const [bedrooms, setBedrooms] = useState(1)
    const [beds, setBeds] = useState(1)
    const [bathrooms, setBathrooms] = useState(1)
    const [amenities, setAmenities] = useState([])
    const [photos, setPhotos] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(237)

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
        if (location.pathname.includes('price')) setCurrentStep(14)
        else if (location.pathname.includes('finish-intro')) setCurrentStep(13)
        else if (location.pathname.includes('description')) setCurrentStep(12)
        else if (location.pathname.includes('title')) setCurrentStep(11)
        else if (location.pathname.includes('photos')) setCurrentStep(10)
        else if (location.pathname.includes('amenities')) setCurrentStep(9)
        else if (location.pathname.includes('stand-out')) setCurrentStep(8)
        else if (location.pathname.includes('floor-plan')) setCurrentStep(7)
        else if (location.pathname.includes('confirm-location')) setCurrentStep(6)
        else if (location.pathname.includes('address-details')) setCurrentStep(5)
        else if (location.pathname.includes('location')) setCurrentStep(4)
        else if (location.pathname.includes('privacy-type')) setCurrentStep(3)
        else if (location.pathname.includes('structure')) setCurrentStep(2)
        else if (location.pathname.includes('about-your-place')) setCurrentStep(1)
        else if (location.pathname.includes('become-a-host')) setCurrentStep(0)
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

                    setGuests(stayFromStore.guests || 4)
                    setBedrooms(stayFromStore.bedrooms || 1)
                    setBeds(stayFromStore.beds || 1)
                    setBathrooms(stayFromStore.bathrooms || 1)
                    setAmenities(stayFromStore.amenities || [])
                    setPhotos(stayFromStore.imgUrls || [])
                    setTitle(stayFromStore.name || '')
                    setDescription(stayFromStore.summary || '')
                    setPrice(stayFromStore.price || 237)

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

    const getPathForStep = (step, id) => {
        const routes = [
            '/become-a-host',
            '/about-your-place',
            '/structure',
            '/privacy-type',
            '/location',
            '/address-details',
            '/confirm-location',
            '/floor-plan',
            '/stand-out',
            '/amenities',
            '/photos',
            '/title',
            '/description',
            '/finish-intro',
            '/price'
        ]

        if (step === 0) return '/stay/edit/become-a-host'
        return `/stay/edit/${id}${routes[step]}`
    }

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
                    address: fullAddress,
                    lat: locationData.lat || loc.lat,
                    lng: locationData.lng || loc.lng
                },
                guests,
                bedrooms,
                beds,
                bathrooms,
                amenities,
                imgUrls: photos,
                name: title,
                summary: currentStep === 14 ? description : `[IN_PROGRESS]${description || ''}`,
                price,
                host: {
                    _id: stayData.host?._id || loggedInUser._id,
                    fullname: stayData.host?.fullname || loggedInUser.fullname,
                    imgUrl: stayData.host?.imgUrl || loggedInUser.imgUrl || null
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
                '/address-details',
                '/confirm-location',
                '/floor-plan',
                '/stand-out',
                '/amenities',
                '/photos',
                '/title',
                '/description',
                '/finish-intro',
                '/price'
            ]
            if (currentStep < nextRoutes.length)
                navigate(`/stay/edit/${savedStay._id}${nextRoutes[currentStep]}`)
            else {
                showSuccessMsg('Stay published successfully!')
                navigate('/hosting/listings')
            }
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
        if (currentStep === 6) navigate(`/stay/edit/${stayId}/address-details`)
        if (currentStep === 7) navigate(`/stay/edit/${stayId}/confirm-location`)
        if (currentStep === 8) navigate(`/stay/edit/${stayId}/floor-plan`)
        if (currentStep === 9) navigate(`/stay/edit/${stayId}/stand-out`)
        if (currentStep === 10) navigate(`/stay/edit/${stayId}/amenities`)
        if (currentStep === 11) navigate(`/stay/edit/${stayId}/photos`)
        if (currentStep === 12) navigate(`/stay/edit/${stayId}/title`)
        if (currentStep === 13) navigate(`/stay/edit/${stayId}/description`)
        if (currentStep === 14) navigate(`/stay/edit/${stayId}/finish-intro`)
    }

    const handleSaveExit = async () => {
        try {
            if (currentStep === 0 || !stayId) {
                navigate('/hosting/listings')
                return
            }

            const fullAddress = loc.street
                ? `${loc.street}${loc.entrance ? `, Entrance ${loc.entrance}` : ''}${loc.apt ? `, Apt ${loc.apt}` : ''}, ${loc.city}${loc.postalCode ? `, ${loc.postalCode}` : ''}, ${loc.country}`
                : address || stayData.address || ''

            const savedPath = getPathForStep(currentStep, stayId)

            await stayService.save({
                ...stayData,
                _id: stayId,
                type: selectedPlaceType || stayData.type || '',
                roomType: selectedPrivacyType || stayData.roomType || '',
                address: fullAddress,
                location: { lat: locationData.lat || loc.lat, lng: locationData.lng || loc.lng },
                loc: {
                    ...loc,
                    address: fullAddress,
                    lat: locationData.lat || loc.lat,
                    lng: locationData.lng || loc.lng
                },
                guests,
                bedrooms,
                beds,
                bathrooms,
                amenities,
                imgUrls: photos,
                name: title,
                summary: `[IN_PROGRESS:${savedPath}]${description || ''}`,
                price,
                host: {
                    _id: stayData.host?._id || loggedInUser._id,
                    fullname: stayData.host?.fullname || loggedInUser.fullname,
                    imgUrl: stayData.host?.imgUrl || loggedInUser.imgUrl || null
                }
            })
            showSuccessMsg('Progress saved')
            navigate('/hosting/listings')
        } catch (err) {
            console.error('Save error:', err)
            showErrorMsg('Could not save stay')
        }
    }

    const isNextDisabled = () => {
        if (currentStep === 2 && !selectedPlaceType) return true
        if (currentStep === 3 && !selectedPrivacyType) return true
        if (currentStep === 4 && !address) return true
        if (currentStep === 5 && (!loc.street || !loc.city)) return true
        if (currentStep === 10 && photos.length < 1) return true
        if (currentStep === 11 && !title) return true
        if (currentStep === 12 && !description) return true
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
            case 6:
                return <StepMapConfirm
                    address={loc.address || address}
                    location={locationData}
                    setLocation={setLocationData}
                />
            case 7:
                return <StepBasics
                    guests={guests}
                    setGuests={setGuests}
                    bedrooms={bedrooms}
                    setBedrooms={setBedrooms}
                    beds={beds}
                    setBeds={setBeds}
                    bathrooms={bathrooms}
                    setBathrooms={setBathrooms}
                />
            case 8:
                return <StepStandOutIntro />
            case 9:
                return <StepAmenities
                    amenities={amenities}
                    setAmenities={setAmenities}
                />
            case 10:
                return <StepPhoto
                    photos={photos}
                    setPhotos={setPhotos}
                />
            case 11:
                return <StepTitle
                    title={title}
                    setTitle={setTitle}
                />
            case 12:
                return <StepDescription
                    description={description}
                    setDescription={setDescription}
                />
            case 13:
                return <StepFinishIntro />
            case 14:
                return <StepPrice
                    price={price}
                    setPrice={setPrice}
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
                    <div className="progress-bar-container" style={{ padding: 0 }}>
                        <div className="progress-segment">
                            <div className="progress-fill"
                                style={{ width: currentStep >= 1 && currentStep <= 5 ? `${(currentStep / 5) * 100}%` : currentStep > 5 ? '100%' : '0%' }}
                            />
                        </div>
                        <div className="progress-segment">
                            <div className="progress-fill"
                                style={{ width: currentStep >= 6 && currentStep <= 10 ? `${((currentStep - 5) / 5) * 100}%` : currentStep > 10 ? '100%' : '0%' }}
                            />
                        </div>
                        <div className="progress-segment">
                            <div className="progress-fill"
                                style={{ width: currentStep >= 11 && currentStep <= 14 ? `${((currentStep - 10) / 4) * 100}%` : '0%' }}
                            />
                        </div>
                    </div>
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                    <button
                        className={`btn btn-black next-button ${isNextDisabled() ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                    >
                        {currentStep === 14 ? 'Publish' : 'Next'}
                    </button>
                </footer>
            )}
        </div>
    )
}