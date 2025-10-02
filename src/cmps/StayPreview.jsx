import { Link } from 'react-router-dom'
import { formatStayDates, calculateNights } from '../services/util.service.js'
import { svgControls } from './Svgs.jsx'

export function StayPreview({ stay }) {
    // console.log('Stay received in StayPreview:', stay)

    const formattedDates = formatStayDates(stay.startDate, stay.endDate)
    // console.log('dates after format:', formattedDates)

    const numNights = calculateNights(stay.startDate, stay.endDate)
    // console.log('number of nights:', numNights)

    const totalPrice = stay.price * numNights

    return <article className="stay-preview">
        <div className='stay-image-wrapper'>
            <Link to={`/stay/${stay._id}`} className='stay-link'>
                <img
                    src={stay.imgUrl || 'https://picsum.photos/200/200?random=1'}
                    alt={stay.name}
                    className='stay-image'
                />
            </Link>
            <button className='heart-btn' aria-label='Add to wishlist'>
                <span className="heart-icon">{svgControls.heart}</span>
            </button>
        </div>
        <div className='stay-info'>
            <header>
                <Link to={`/stay/${stay._id}`} className="stay-name">
                    {stay.name}
                </Link>
            </header>
            <p className='stay-dates'>{formattedDates}</p>
            <div className='stay-details'>
                <span className='stay-price'>
                    ${totalPrice.toLocaleString()}{' '}for {numNights} {numNights === 1 ? 'night' : 'nights'}
                </span>
                <span className='separator'>{' '}•</span>
                <span className='stay-rating'>
                    <span className='star-icon'>{' '}★</span>
                    <span>{stay.rating || 4.85}</span>
                </span>
            </div>
        </div>

    </article>
}