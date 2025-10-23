import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { loadOrders, updateOrder } from '../store/actions/order.actions';
import { formatDateWithFullYear, formatGuestsText, capitalizeFirst } from '../services/util.service';
import { DotsLoader } from '../cmps/SmallComponents';
import { Modal } from '../cmps/Modal';
import { appHeaderSvg } from '../cmps/Svgs';

export function ReservationsPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [sortDirection, setSortDirection] = useState('asc')
    const [viewMode, setViewMode] = useState('table')
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, order: null, action: null })

    const loggedInUser = useSelector((state) => state.userModule.loggedInUser)
    const orders = useSelector(storeState => storeState.orderModule.orders)
    const isLoading = useSelector(storeState => storeState.orderModule.isLoading)

    useEffect(() => {
        loadOrders()
    }, [])

    const hostOrders = useMemo(() => {
        if (!orders) {
            console.log('No orders available')
            return []
        }
        // console.log('Total orders:', orders.length)
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

    const handleStatusAction = (order, action) => {
        setConfirmModal({ isOpen: true, order, action })
    }

    const confirmStatusChange = async () => {
        const { order, action } = confirmModal
        try {
            const newStatus = action === 'approve' ? 'approved' : 'rejected'
            const updatedOrder = { ...order, status: newStatus }
            await updateOrder(updatedOrder)
        } catch (err) {
            console.error('Failed to update order status:', err)
        } finally {
            setConfirmModal({ isOpen: false, order: null, action: null })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'var(--pending)'
            case 'approved': return 'var(--confirmed)'
            case 'rejected': return 'var(--canceled)'
            default: return 'var(--gray3)'
        }
    }

    if (isLoading || !orders) return <DotsLoader />

    return (
        <div className="reservations-container">
            <div className="reservations-content">
                <div className="reservations-header">
                    <h1 className="page-title">Reservations</h1>

                    <div className="view-toggle">
                        <button
                            className={`view-btn btn btn-round plus-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Table view"
                        >
                            {appHeaderSvg.menu}
                        </button>
                        <button
                            className={`view-btn btn btn-round plus-btn ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                            title="Cards view"
                        >
                            {appHeaderSvg.cards}
                        </button>
                    </div>
                </div>

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

                {/* Table View - desktop */}
                {viewMode === 'table' && (
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
                                                    onChange={(ev) => handleStatusAction(order, ev.target.value === 'approved' ? 'approve' : 'reject')}
                                                    style={{ color: getStatusColor(order.status) }}
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
                                            <td className="date-cell checkout-date-cell">{formatDateWithFullYear(order.endDate)}</td>
                                            <td className="listing-cell">{order.stay.name}</td>
                                            <td className="payout-cell">${order.totalPrice}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Cards View - best for mobile.. */}
                {viewMode === 'cards' && (
                    <div className="cards-container">
                        <div className="cards-sort-bar">
                            <button className="sort-button btn btn-pill" onClick={toggleSort}>
                                Sort by date: {sortDirection === 'asc' ? 'Earliest first' : 'Latest first'}
                                <span className="sort-icon">{sortDirection === 'asc' ? '▴' : '▾'}</span>
                            </button>
                        </div>

                        {sortedOrders.length === 0 ? (
                            <div className="empty-state-cards">
                                No reservations found
                            </div>
                        ) : (
                            <div className="cards-grid">
                                {sortedOrders.map((order) => (
                                    <div key={order._id} className="reservation-card">
                                        <div className="card-image">
                                            <img src={order.stay.imgUrl} alt={order.stay.name} />
                                            <div className="status-badge">
                                                <span className={`status-dot ${order.status}`}></span>
                                                {order.status}
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <h3 className="card-title">{order.stay.name}</h3>

                                            <div className="card-guest-info">
                                                <div className="guest-avatar">
                                                    {order.guest.imgUrl ? (
                                                        <img src={order.guest.imgUrl} alt={order.guest.fullname} />
                                                    ) : (
                                                        <div className="guest-placeholder">
                                                            {order.guest.fullname.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="guest-details">
                                                    <p className="guest-name">{order.guest.fullname}</p>
                                                    <p className="guest-count">{formatGuestsText(order.guests)}</p>
                                                </div>
                                            </div>

                                            <div className="card-dates">
                                                <div className="date-row">
                                                    <span className="date-label">Check-in:</span>
                                                    <span className="date-value">{formatDateWithFullYear(order.startDate)}</span>
                                                </div>
                                                <div className="date-row">
                                                    <span className="date-label">Checkout:</span>
                                                    <span className="date-value">{formatDateWithFullYear(order.endDate)}</span>
                                                </div>
                                            </div>

                                            <div className="card-price">
                                                <span className="price-label">Total payout:</span>
                                                <span className="price-value">${order.totalPrice}</span>
                                            </div>

                                            {order.status === 'pending' && (
                                                <div className="card-actions">
                                                    <button
                                                        className="action-btn approve-btn btn btn-pill"
                                                        onClick={() => handleStatusAction(order, 'approve')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="action-btn reject-btn btn btn-pill"
                                                        onClick={() => handleStatusAction(order, 'reject')}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Confirmation Modal */}
                <Modal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal({ isOpen: false, order: null, action: null })}
                    header={
                        <h2 className="modal-title">
                            {confirmModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </h2>
                    }
                    className="confirm-modal"
                >
                    <div className="confirm-content">
                        <p className="confirm-message">
                            Are you sure you want to {confirmModal.action === 'approve' ? 'approve' : 'reject'} this booking?
                        </p>
                       

                        <div className="confirm-actions">
                            <button
                                className="action-btn btn btn-pill cancel-btn"
                                onClick={() => setConfirmModal({ isOpen: false, order: null, action: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className={`action-btn btn btn-pill confirm-btn ${confirmModal.action === 'approve' ? 'approve-confirm-btn' : 'reject-confirm-btn'}`}
                                onClick={confirmStatusChange}
                            >
                                {confirmModal.action === 'approve' ? 'Approve Booking' : 'Reject Booking'}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}