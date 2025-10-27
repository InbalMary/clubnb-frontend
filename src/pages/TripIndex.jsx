import { useSelector } from "react-redux"
import { loadOrders } from "../store/actions/order.actions.js"
import { useEffect, useState } from "react"
import { TripList } from '../cmps/TripList'
import { DotsLoader } from "../cmps/SmallComponents.jsx"

export function TripIndex() {
    const [activeTab, setActiveTab] = useState('upcoming')
    const orders = useSelector(storeState => storeState.orderModule.orders)
    const isLoading = useSelector(storeState => storeState.orderModule.isLoading)

    useEffect(() => {
        if (!orders || orders.length === 0) {
            loadOrders()
        }
    }, [])

    const filterOrders = () => {
        if (!orders || orders.length === 0) return []

        const now = new Date()

        if (activeTab === 'upcoming') {
            return orders.filter(order => {
                const startDate = new Date(order.startDate)
                return startDate >= now
            })
        } else {
            return orders.filter(order => {
                const endDate = new Date(order.endDate)
                return endDate < now
            })
        }
    }

    const filteredOrders = filterOrders()

    return (
        <section className="trip-index">
            <h1 className="trip-title">Trips</h1>

            <div className="trip-tabs">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past
                </button>
            </div>

            <div className="trip-content">
                {isLoading ? (
                    <DotsLoader />
                ) : filteredOrders.length === 0 ? (
                    <p className="no-trips">
                        {activeTab === 'upcoming'
                            ? 'No upcoming trips yet'
                            : 'No past trips'}
                    </p>
                ) : (
                    <TripList orders={filteredOrders} />
                )}
            </div>
        </section>
    )
}