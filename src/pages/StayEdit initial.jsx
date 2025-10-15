import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { stayService } from '../services/stay/'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { ImgUploader } from "../cmps/ImgUploader";
import { DateRangePicker } from "../cmps/DateRangePicker";

export function StayEdit() {
    const [stay, setStay] = useState(stayService.getEmptyStay())
    const { stayId } = useParams()
    const navigate = useNavigate()

    const [dateRange, setDateRange] = useState({ from: null, to: null })
    const [activeField, setActiveField] = useState('checkin')

    useEffect(() => {
        if (stayId) loadStay()
    }, [])

    function loadStay() {
        stayService.getById(stayId)
            .then(stayData => {
                setStay(stayData);
                setDateRange({
                    from: stayData.startDate ? new Date(stayData.startDate) : null,
                    to: stayData.endDate ? new Date(stayData.endDate) : null
                })
            })
            .catch(err => {
                console.log('Cannot load stay:', err)
                showErrorMsg('Stay not found!')
                navigate('/')
            })
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setStay(prev => ({ ...prev, [field]: value }))
    }

    function handleDateComplete(range) {
        setDateRange(range)
        setStay(prev => ({
            ...prev,
            startDate: range.from ? range.from.toISOString().split('T')[0] : '',
            endDate: range.to ? range.to.toISOString().split('T')[0] : ''
        }));
        if (activeField === 'checkin' && range.from && !range.to) {
            setActiveField('checkout')
        }
    }

    function handleImgUpload(imgUrl) {
        setStay(prev => ({ ...prev, imgUrls: [imgUrl] }))
    }

    function onSaveStay(ev) {
        ev.preventDefault()
        const DEFAULT_IMG_URL = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofGFwfHxhcGFydG1lbnR8ZW58MHx8fHwxNjc1NTk3NTEx&ixlib=rb-4.0.3&q=80&w=600";

        const stayToSave = {
            ...stay,
            imgUrls: stay.imgUrls?.length ? stay.imgUrls : [DEFAULT_IMG_URL]
        }

        stayService.save(stayToSave)
            .then(() => {
                showSuccessMsg('Stay saved successfully')
                navigate('/')
            })
            .catch(err => {
                console.log('Cannot save stay', err)
                showErrorMsg('Cannot save stay')
            })
    }

    function onCancel() {
        navigate('/')
    }

    return (
        <section className="stay-edit">
            <h2>{stay._id ? 'Edit' : 'Add'} Stay</h2>
            <form onSubmit={onSaveStay} className="stay-edit-form">
                <label>
                    Name:
                    <input type="text" name="name" value={stay.name || ''} onChange={handleChange} required />
                </label>

                <label>
                    Price:
                    <input type="number" name="price" value={stay.price ?? 0} onChange={handleChange}  required />
                </label>

                <label>
                    Cleaning Fee:
                    <input type="number" name="cleaningFee" value={stay.cleaningFee ?? 0} onChange={handleChange} />
                </label>

                <label>
                    Capacity:
                    <input type="number" name="capacity" value={stay.capacity ?? 1} onChange={handleChange} required />
                </label>

                <label>
                    Bedrooms:
                    <input type="number" name="bedrooms" value={stay.bedrooms ?? 1} onChange={handleChange} required />
                </label>

                <label>
                    Bathrooms:
                    <input type="number" name="bathrooms" value={stay.bathrooms ?? 1} onChange={handleChange} required />
                </label>

                <label>
                    Summary:
                    <textarea name="summary" value={stay.summary || ''} onChange={handleChange} rows="3" />
                </label>

                <div className="date-picker-container">
                    <button type="button" onClick={() => setActiveField('checkin')}>
                        Check in: {dateRange.from ? dateRange.from.toLocaleDateString() : 'Add date'}
                    </button>
                    <button type="button" onClick={() => setActiveField('checkout')}>
                        Check out: {dateRange.to ? dateRange.to.toLocaleDateString() : 'Add date'}
                    </button>
                    <div className="modal">
                        <DateRangePicker
                            value={dateRange}
                            onComplete={handleDateComplete}
                            activeField={activeField}
                        />
                    </div>
                </div>

                <ImgUploader onUpload={handleImgUpload} imgUrl={stay.imgUrls?.[0]} />

                <div className="form-actions">
                    <button type="submit">{stay._id ? 'Save' : 'Add'}</button>
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </form>

            {stay.imgUrls && stay.imgUrls.length > 0 && (
                <div className="img-preview">
                    <h4>Preview Image:</h4>
                    <img src={stay.imgUrls[0]} alt="Stay" />
                </div>
            )}
        </section>
    )
}