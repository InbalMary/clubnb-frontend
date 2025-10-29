import { useSelector } from "react-redux"
import { loadOrders } from "../store/actions/order.actions.js"
import { useEffect, useState } from "react"
import { TripList } from '../cmps/TripList'
import { DotsLoader } from "../cmps/SmallComponents.jsx"
import { socketService } from "../services/socket.service.js"
import confetti from 'canvas-confetti'

export function TripIndex() {
    const [activeTab, setActiveTab] = useState('upcoming')
    const orders = useSelector(storeState => storeState.orderModule.orders)
    const isLoading = useSelector(storeState => storeState.orderModule.isLoading)
    const loggedinUser = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        if (loggedinUser) {
            loadOrders({ guestId: loggedinUser._id })
        }
    }, [loggedinUser])

    useEffect(() => {
        if (!loggedinUser) return

        socketService.on('update-guest-orders', (updatedOrder) => {
            console.log('Order status updated:', updatedOrder)

            const isMyOrder = updatedOrder.guest?._id?.toString() === loggedinUser._id.toString() ||
                updatedOrder.guestId?.toString() === loggedinUser._id.toString()

            if (isMyOrder && updatedOrder.status === 'approved') {
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#FF385C', '#00A699', '#FFB400', '#8B5CF6', '#EC4899']
                })
            }

            loadOrders({ guestId: loggedinUser._id })
        })

        return () => {
            socketService.off('update-guest-orders')
        }
    }, [loggedinUser])

    const filterOrders = () => {
        if (!orders || orders.length === 0 || !loggedinUser) return []

        const now = new Date()
        const userId = loggedinUser._id.toString()
        const userOrders = orders.filter(order => {
            const guestId = order.guest?._id?.toString() || order.guestId?.toString()
            return guestId === userId
        })

        if (activeTab === 'upcoming') {
            return userOrders.filter(order => {
                const startDate = new Date(order.startDate)
                return startDate >= now
            })
        } else {
            return userOrders.filter(order => {
                const endDate = new Date(order.endDate)
                return endDate < now
            })
        }
    }

    const filteredOrders = filterOrders()

    return (
        <section className="trip-index">
            <div className="trip-container">
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
                    ) : !loggedinUser ? (
                        <p className="no-trips">Please log in to view your trips</p>
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
            </div>
        </section>
    )
}