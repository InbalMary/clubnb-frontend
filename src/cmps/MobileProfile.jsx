import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { logout } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { svgControls } from './Svgs'

export function MobileProfile() {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [imgError, setImgError] = useState(false)

    const isHostPage = window.location.pathname.includes("hosting")
    const hostTo = isHostPage ? "/" : "/hosting/reservations"
    const hostText = isHostPage ? "Switch to traveling" : "Switch to hosting"

    async function handleLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    function handleNavigation(path) {
        navigate(path)
    }

    function handleImageError() {
        setImgError(true)
    }

    return (
        <div className="mobile-profile">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>

            <div
                className="profile-user-card"
                onClick={() => user && handleNavigation(`/user/${user._id}`)}
                style={{ cursor: user ? 'pointer' : 'default' }}
            >
                {user?.imgUrl && !imgError ? (
                    <div className="profile-avatar">
                        <img
                            src={user.imgUrl}
                            alt={user.fullname}
                            onError={handleImageError}
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ) : (
                    <div className="profile-avatar profile-avatar-initials">
                        {user?.fullname?.[0]?.toUpperCase() || 'G'}
                    </div>
                )}
                <h2 className="profile-name">{user?.fullname || 'Guest'}</h2>
                <p className="profile-status">Guest</p>
            </div>

            <div
                className="profile-host-card"
                onClick={() => handleNavigation(user ? hostTo : '/auth/login')}
            >
                <img
                    className="profile-host-icon"
                    src="/img/become-host.png"
                    alt="Become a host"
                />
                <div className="profile-host-text">
                    <h3>{user ? hostText : 'Become a host'}</h3>
                    <p>It's easy to start hosting and earn extra income.</p>
                </div>
            </div>

            <div className="profile-menu">
                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/account-settings')}
                >
                    <span className="profile-menu-icon">{svgControls.settings}</span>
                    <span className="profile-menu-text">Account settings</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation(`/user/${user?._id}`)}
                >
                    <span className="profile-menu-icon">{svgControls.profileInSetting}</span>
                    <span className="profile-menu-text">View profile</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/privacy')}
                >
                    <span className="profile-menu-icon">{svgControls.privacy}</span>
                    <span className="profile-menu-text">Privacy</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/help')}
                >
                    <span className="profile-menu-icon">{svgControls.help}</span>
                    <span className="profile-menu-text">Get help</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <div className="profile-divider" />

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/refer-host')}
                >
                    <span className="profile-menu-icon">{svgControls.referHost}</span>
                    <span className="profile-menu-text">Refer a host</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/find-cohost')}
                >
                    <span className="profile-menu-icon">{svgControls.findCoHost}</span>
                    <span className="profile-menu-text">Find a co-host</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/gift-cards')}
                >
                    <span className="profile-menu-icon">{svgControls.giftcard}</span>
                    <span className="profile-menu-text">Gift cards</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <button
                    className="profile-menu-item"
                    onClick={() => handleNavigation('/legal')}
                >
                    <span className="profile-menu-icon">{svgControls.legal}</span>
                    <span className="profile-menu-text">Legal</span>
                    <span className="profile-menu-arrow">›</span>
                </button>

                <div className="profile-divider" />

                {user ? (
                    <button
                        className="profile-menu-item"
                        onClick={handleLogout}
                    >
                        <span className="profile-menu-icon">{svgControls.logout}</span>
                        <span className="profile-menu-text">Log out</span>
                        <span className="profile-menu-arrow">›</span>
                    </button>
                ) : (
                    <button
                        className="profile-menu-item"
                        onClick={() => handleNavigation('/auth/login')}
                    >
                        <span className="profile-menu-icon">{svgControls.profile}</span>
                        <span className="profile-menu-text">Log in or sign up</span>
                        <span className="profile-menu-arrow">›</span>
                    </button>
                )}
            </div>
        </div>
    )
}