import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { loadOrders, updateOrder } from '../store/actions/order.actions';
import { formatDateWithFullYear, formatGuestsText, capitalizeFirst } from '../services/util.service';

export function ReservationsPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [sortDirection, setSortDirection] = useState('asc')

    const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
    const orders = useSelector(storeState => storeState.orderModule.orders)

    useEffect(() => {
        loadOrders()
    }, [])

    const hostOrders = useMemo(() => {
        if (!orders) {
            console.log('No orders available')
            return []
        }
        console.log('Total orders:', orders.length)
        // For now, return all orders..
        return orders

        // if (!loggedInUser) return []
        // return orders.filter(order => order.host._id === loggedInUser._id)
    }, [orders, loggedInUser])

    const filteredOrders = useMemo(() => {
        const now = new Date()

        switch (activeTab) {
            case 'upcoming':
                return hostOrders.filter(order =>
                    new Date(order.startDate) > now &&
                    (order.status === 'approved' || order.status === 'pending')
                )
            case 'completed':
                return hostOrders.filter(order =>
                    new Date(order.endDate) < now &&
                    order.status === 'approved'
                )
            case 'canceled':
                return hostOrders.filter(order => order.status === 'rejected')
            case 'all':
            default:
                return hostOrders
        }
    }, [hostOrders, activeTab])

    const sortedOrders = useMemo(() => {
        return [...filteredOrders].sort((a, b) => {
            const dateA = new Date(a.startDate)
            const dateB = new Date(b.startDate)
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        })
    }, [filteredOrders, sortDirection])

    const toggleSort = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    }

    const onHandleStatusChange = async (order, newStatus) => {
        try {
            const updatedOrder = { ...order, status: newStatus }
            await updateOrder(updatedOrder)
            setEditingOrderId(null)
        } catch (err) {
            console.error('Failed to update order status:', err)
        }
    }

    if (!orders) {
        return <div className="reservations-container">Loading...</div>
    }

    return (
        <div className="reservations-container">
            <div className="reservations-content">
                <h1 className="page-title">Reservations</h1>

                <div className="tabs-container">
                    <button
                        className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'canceled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('canceled')}
                    >
                        Canceled
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                </div>

                <div className="table-container">
                    <table className="reservations-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Guests</th>
                                <th className="sortable" onClick={toggleSort}>
                                    Check-in {sortDirection === 'asc' ? '▴' : '▾'}
                                </th>
                                <th>Checkout</th>
                                <th>Listing</th>
                                <th>Total Payout</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        No reservations found
                                    </td>
                                </tr>
                            ) : (
                                sortedOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <select
                                                className="status-dropdown"
                                                value={order.status}
                                                onChange={(ev) => onHandleStatusChange(order, ev.target.value)}
                                                style={{
                                                    color:
                                                        order.status === "pending"
                                                            ? "var(--pending)"
                                                            : order.status === "approved"
                                                                ? "var(--confirmed)"
                                                                : "var(--canceled)",
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>

                                        </td>
                                        <td>
                                            <div className="guests-cell">
                                                <div className="guest-avatar">
                                                    {order.guest.imgUrl ? (
                                                        <img src={order.guest.imgUrl} alt={order.guest.fullname} />
                                                    ) : (
                                                        <div className="guest-placeholder">
                                                            {order.guest.fullname.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="guest-count">{formatGuestsText(order.guests)}</span>
                                            </div>
                                        </td>
                                        <td className="date-cell">{formatDateWithFullYear(order.startDate)}</td>
                                        <td className="date-cell">{formatDateWithFullYear(order.endDate)}</td>
                                        <td className="listing-cell">{order.stay.name}</td>
                                        <td className="payout-cell">${order.totalPrice}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}