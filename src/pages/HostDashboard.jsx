import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { loadOrders } from '../store/actions/order.actions';
import { DotsLoader } from '../cmps/SmallComponents';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export function HostDashboard() {
    const orders = useSelector(storeState => storeState.orderModule.orders)
    const isLoading = useSelector(storeState => storeState.orderModule.isLoading)
    const loggedInUser = useSelector(state => state.userModule.user)

    useEffect(() => {
        loadOrders()
    }, [])

    // Calculate statistics
    const stats = useMemo(() => {
        if (!orders || orders.length === 0) return null

        const approvedOrders = orders.filter(o => o.status === 'approved')
        const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.totalPrice, 0)
        const avgBookingValue = approvedOrders.length > 0 ? totalRevenue / approvedOrders.length : 0

        const now = new Date()
        const upcomingOrders = orders.filter(order =>
            new Date(order.startDate) > now && order.status === 'approved'
        )

        return {
            totalRevenue,
            totalBookings: orders.length,
            approvedBookings: approvedOrders.length,
            upcomingBookings: upcomingOrders.length,
            avgBookingValue,
            pendingBookings: orders.filter(order => order.status === 'pending').length,
            rejectedBookings: orders.filter(order => order.status === 'rejected').length,
        }
    }, [orders])

    // Revenue Over Time (Last 6 months)
    const revenueChartData = useMemo(() => {
        if (!orders) return null

        const months = []
        const revenue = []
        const now = new Date()

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthName = date.toLocaleString('default', { month: 'short' })
            months.push(monthName)

            const monthRevenue = orders
                .filter(o => {
                    const orderDate = new Date(o.startDate)
                    return orderDate.getMonth() === date.getMonth() &&
                        orderDate.getFullYear() === date.getFullYear() &&
                        o.status === 'approved'
                })
                .reduce((sum, o) => sum + o.totalPrice, 0)

            revenue.push(monthRevenue)
        }

        return {
            labels: months,
            datasets: [
                {
                    label: 'Revenue ($)',
                    data: revenue,
                    borderColor: 'rgb(255, 56, 92)',
                    backgroundColor: 'rgba(255, 56, 92, 0.1)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        }
    }, [orders])

    // Booking Status Distribution
    const statusChartData = useMemo(() => {
        if (!stats) return null

        return {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [
                {
                    data: [stats.approvedBookings, stats.pendingBookings, stats.rejectedBookings],
                    backgroundColor: [
                        'rgba(0, 166, 153, 0.8)',
                        'rgba(255, 180, 0, 0.8)',
                        'rgba(255, 56, 92, 0.8)',
                    ],
                    borderColor: [
                        'rgb(0, 166, 153)',
                        'rgb(255, 180, 0)',
                        'rgb(255, 56, 92)',
                    ],
                    borderWidth: 2,
                },
            ],
        }
    }, [stats])

    // Bookings by Property
    const propertyChartData = useMemo(() => {
        if (!orders) return null

        const propertyStats = {}
        orders.forEach(order => {
            const name = order.stay.name
            if (!propertyStats[name]) {
                propertyStats[name] = 0
            }
            propertyStats[name]++
        })

        const sortedProperties = Object.entries(propertyStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)

        return {
            labels: sortedProperties.map(([name]) => name),
            datasets: [
                {
                    label: 'Number of Bookings',
                    data: sortedProperties.map(([, count]) => count),
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                    ],
                    borderColor: [
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)',
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                    ],
                    borderWidth: 2,
                },
            ],
        }
    }, [orders])

    // Guest Count Distribution
    const guestChartData = useMemo(() => {
        if (!orders) return null

        const guestRanges = {
            '1-2': 0,
            '3-4': 0,
            '5-6': 0,
            '7-8': 0,
            '9+': 0,
        }

        orders.forEach(order => {
            const total = order.guests.adults + order.guests.children
            if (total <= 2) guestRanges['1-2']++
            else if (total <= 4) guestRanges['3-4']++
            else if (total <= 6) guestRanges['5-6']++
            else if (total <= 8) guestRanges['7-8']++
            else guestRanges['9+']++
        })

        return {
            labels: Object.keys(guestRanges),
            datasets: [
                {
                    data: Object.values(guestRanges),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                    ],
                    borderWidth: 2,
                },
            ],
        }
    }, [orders])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    }

    if (isLoading || !orders) return <DotsLoader />
    if (!stats) return <div className="empty-state">No data available</div>

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1 className="dashboard-title">Dashboard</h1>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card revenue-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3 className="stat-value">${stats.totalRevenue.toLocaleString()}</h3>
                            <p className="stat-label">Total Revenue</p>
                        </div>
                    </div>

                    <div className="stat-card bookings-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3 className="stat-value">{stats.totalBookings}</h3>
                            <p className="stat-label">Total Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card upcoming-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <h3 className="stat-value">{stats.upcomingBookings}</h3>
                            <p className="stat-label">Upcoming Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card avg-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3 className="stat-value">${Math.round(stats.avgBookingValue)}</h3>
                            <p className="stat-label">Avg Booking Value</p>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3 className="chart-title">Revenue Trend (Last 6 Months)</h3>
                        <div className="chart-wrapper">
                            <Line data={revenueChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">Booking Status Distribution</h3>
                        <div className="chart-wrapper">
                            <Doughnut data={statusChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">Top 5 Properties by Bookings</h3>
                        <div className="chart-wrapper">
                            <Bar data={propertyChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">Guest Group Size Distribution</h3>
                        <div className="chart-wrapper">
                            <Pie data={guestChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}