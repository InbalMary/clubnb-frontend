import { TripPreview } from './TripPreview'

export function TripList({ orders }) {
    const groupedByYear = orders.reduce((acc, order) => {
        const year = new Date(order.startDate).getFullYear()
        if (!acc[year]) acc[year] = []
        acc[year].push(order)
        return acc
    }, {})

    const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a)

    return (
        <section className='trip-list-section'>
            {sortedYears.map(year => (
                <div className='trip-year-group' key={year}>
                    <div className='trip-year-header'>
                        <button className="year-badge">{year}</button>
                    </div>

                    <ul className="trip-preview-list clean-list">
                        {groupedByYear[year].map(order => (
                            <li key={order._id || order.stay?._id}>
                                <TripPreview order={order} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    )
}