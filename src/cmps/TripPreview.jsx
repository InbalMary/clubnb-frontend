import { Link } from 'react-router-dom'
import { formatDateRange } from '../services/util.service.js'

export function TripPreview({ order }) {
    const stay = order.stay
    if (!stay) {
        console.warn("TripPreview missing stay for order:", order)
        return null
    }
    const formattedDates = formatDateRange(order.startDate, order.endDate)

    return (
        <article className="trip-preview">
            <div className='trip-image-wrapper'>
                <Link to={`/stay/${stay._id}`} className='trip-link'>
                    <img
                        src={stay.imgUrls?.[0] || stay.imgUrl || 'https://picsum.photos/200/200?random=1'}
                        alt={stay.name}
                        className='trip-image'
                    />
                </Link>
            </div>

            <div className='trip-info'>
                <header>
                    <Link to={`/stay/${stay._id}`} className="trip-name">
                        {stay.name}
                    </Link>
                </header>
                <p className='trip-dates'>{formattedDates}</p>
            </div>
        </article>
    )
}