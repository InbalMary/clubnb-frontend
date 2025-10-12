import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { appHeaderSvg } from './Svgs'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { useClickOutside } from "../customHooks/useClickOutside";

export function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const buttonRef = useRef(null)
    const menuRef = useRef(null)

    useClickOutside([buttonRef, menuRef], () => {
        if (isOpen) setIsOpen(false)
    })

    function toggleMenu() {
        setIsOpen(!isOpen)
    }

    async function handleLogout() {
        try {
            await logout()
            setIsOpen(false)
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    function handleNavigation(path) {
        navigate(path)
        setIsOpen(false)
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                className={`hamburger-menu-btn`}
                onClick={toggleMenu}
                aria-label="Main menu"
                aria-haspopup="menu"
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls="header-menu"
            >
                {/* {user && user.imgUrl && (
                    <span className='profile-icon'>
                        <img src={user.imgUrl} alt={user.fullname} />
                    </span>
                )} */}
                <span className='hamburger'>
                    {appHeaderSvg.hamburger}
                </span>
            </button>

            {isOpen && (
                <div className="hamburger-overlay" onClick={toggleMenu} />
            )}

            {isOpen && (
                <div ref={menuRef} id="header-menu" className={`header-menu ${user ? 'user-logged' : ''}`} role="menu">

                    <div className="menu-header">
                        <span className="menu-icon">?</span>
                        <span>Help Center</span>
                    </div>

                    <hr />

                    <button
                        className="menu-row menu-row-host"
                        role="menuitem"
                        onClick={() => handleNavigation('/become-a-host')}
                    >
                        <div className="menu-row-text">
                            <span className="menu-title">Become a host</span>
                            <span className="menu-sub">
                                It's easy to start hosting and earn extra income.
                            </span>
                        </div>
                        <img
                            className="menu-host-icon"
                            alt=""
                            src={`/img/become-host.png`}
                        />
                    </button>

                    <hr />

                    {user && (
                        <>
                            <button className="menu-row" role="menuitem" onClick={() => handleNavigation('/wishlists')}>
                                <span ><img className="svg-icon" src="/img/wishlists.svg" alt="" /></span>Wishlists
                            </button>
                            <button className="menu-row" role="menuitem" onClick={() => handleNavigation('/trips')}>
                                <span ><img className="svg-icon" src="/img/trips.svg" alt="" /></span>Trips
                            </button>
                            <button className="menu-row" role="menuitem" onClick={() => handleNavigation('/Messages')}>
                                <span ><img className="svg-icon" src="/img/msgs.svg" alt="" /></span>Messages
                            </button>
                            <button className="menu-row" role="menuitem" onClick={() => handleNavigation(`/user/${user._id}`)}>
                                <span ><img className="svg-icon" src="/img/login.svg" alt="" /></span>Profile
                            </button>

                            <hr />
                        </>
                    )}

                    <button className="menu-row" role="menuitem">Refer a Host</button>
                    <button className="menu-row" role="menuitem">Find a co-host</button>
                    <button className="menu-row" role="menuitem">Gift cards</button>

                    <hr />

                    {user ? (
                        <div className="menu-auth-rows">
                            <button
                                className="menu-row"
                                role="menuitem"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="menu-auth-rows">
                            <button
                                className="menu-row"
                                role="menuitem"
                                onClick={() => handleNavigation('/auth/login')}
                            >
                                Log in or sign up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}