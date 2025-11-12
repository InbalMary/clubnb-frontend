import { Modal } from './Modal'
import { ImgUploader } from './ImgUploader'
import { useState, useEffect, useRef } from 'react'

import { userService } from '../services/user/user.service.remote'
import { login, signup } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { useLocation, useNavigate } from 'react-router'
import { logoSvgs } from './Svgs'
import { FancyButton } from './SmallComponents'
import { useSelector } from 'react-redux'
import { useScrollLock } from '../customHooks/useScrollLock'
import { jwtDecode } from 'jwt-decode'
import { loadWishlists } from '../store/actions/wishlist.actions'
import { useIsBreakPoint } from '../customHooks/useIsBreakPoint'

export function LoginSignupModal({ isOpen, onClose, title = 'Log in or sign up', subtitle = 'Welcome to Clubnb', onLoginSuccess, isFromWishlist }) {

    const [modalType, setModalType] = useState('signup')
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)
    const [guestUser, setGuestUser] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        loadGuestUser()
    }, [])


    useScrollLock(isOpen)

    async function loadGuestUser() {
        try {
            const users = await userService.getUsers()
            const user = users.find(user => user.username === 'guest')
            setGuestUser(user)
        } catch (err) {
            showErrorMsg('Failed to load guest user')
            console.log('Failed to load guest user', err)
        }
    }

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    useEffect(() => {

    }, [loggedinUser])

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    async function onLogin(credentials, selectedType = modalType) {
        onClose() // close early to prevent flicker 
        try {
            let user
            if (selectedType === 'signup') {
                user = await signup(credentials)
                showSuccessMsg('Signed in successfully')
            } else {
                user = await login(credentials)
                showSuccessMsg(`Welcome, ${user.fullname || 'guest'}!`)
            }

            clearState()

            if (onLoginSuccess) {
                setTimeout(() => {
                    onLoginSuccess()
                }, 100)
            } else {
                onClose()
            }
        } catch (err) {
            const msg = selectedType === 'signup'
                ? 'Had a problem signing up'
                : 'Had a problem logging in'
            showErrorMsg(msg)
            console.error('Login error:', err)
        }
    }

    // async function onLogin(credentials, selectedType = modalType) {
    //     onClose() // close early to prevent flicker 
    //     try {
    //         if (selectedType === 'signup') {
    //             await signup(credentials)
    //             showSuccessMsg('Signed in successfully')
    //         } else {
    //             await login(credentials)
    //             showSuccessMsg(`Welcome, ${credentials?.fullname || 'guest'}!`)
    //         }
    //         clearState()
    //         if (loggedinUser?._id) {
    //             await loadWishlists(loggedinUser._id)
    //         }

    //         if (onLoginSuccess) {
    //             setTimeout(() => {
    //                 onLoginSuccess()
    //             }, 100)
    //         } else {
    //             onClose()
    //         }
    //     } catch (err) {
    //         const msg = selectedType === 'signup'
    //             ? 'Had a problem signing up'
    //             : 'Had a problem logging in'
    //         showErrorMsg(msg)
    //         console.error('Login error:', err)
    //     }
    // }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    async function onGuestLogin() {
        try {
            if (!guestUser) {
                showErrorMsg('Guest user not available')
                return
            }

            const guestCreds = {
                username: guestUser.username,
                password: guestUser.password
            }

            setCredentials(guestCreds)
            await login(guestCreds)
            showSuccessMsg(`Welcome, ${guestUser.fullname}!`)
            if (onLoginSuccess) {
                setTimeout(() => {
                    onLoginSuccess()
                    onClose()
                }, 100)
            } else {
                onClose()
            }
        } catch (err) {
            showErrorMsg('Had problem logging guest')
            console.error('Login error:', err)
        }
    }

    function handleToggleType() {
        setModalType(prev => (prev === 'login' ? 'signup' : 'login'))
    }

    const isMobile = useIsBreakPoint(744)

    return (

        <Modal
            header={title}
            isOpen={isOpen}
            onClose={onClose}
            closePosition='left'
            useBackdrop={true}
            className={`login-signup-modal ${isMobile ? 'mobile' : ''}`}
        >
            <h2 className={isFromWishlist ? 'login-modal-subtitle' : ''}>
                {subtitle}
            </h2>
            {modalType === 'signup' &&
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullname"
                        autoComplete='fullname'
                        value={credentials.fullname}
                        placeholder="Fullname"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        autoComplete='username'
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <ImgUploader onUploaded={onUploaded} />
                    <FancyButton>Signup</FancyButton>
                </form>
            }

            {modalType === 'login' &&
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="text"
                        className="login-username"
                        name="username"
                        autoComplete="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange} />

                    <input type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        className="login-password"
                        value={credentials.password}
                        onChange={handleChange} />

                    <FancyButton>Login</FancyButton>
                </form>
            }

            <div className="border"><div>or</div></div>
            <div className="login-options">
                <button onClick={handleToggleType} className="btn">{modalType === 'login' ? 'Signup' : 'Login'}</button>
                {modalType === 'login' && <button onClick={onGuestLogin} className="btn">Login as a guest</button>}
                <GoogleLoginButton modalType={modalType} onLogin={onLogin}>
                    {modalType === 'signup' ? 'Sign up with Google' : 'Login with Google'}
                </GoogleLoginButton>
            </div>

        </Modal >
    )
}


function GoogleLoginButton({ modalType, onLogin, children }) {
    const modalTypeRef = useRef(modalType)

    useEffect(() => {
        modalTypeRef.current = modalType
    }, [modalType])

    // let tokenClient
    const tokenClientRef = useRef(null)

    useEffect(() => {
        // Check if the script already exists (avoid duplicates)
        if (!document.getElementById("google-client-script")) {
            const script = document.createElement("script")
            script.src = "https://accounts.google.com/gsi/client"
            script.id = "google-client-script"
            script.async = true
            script.defer = true
            script.onload = initGoogleClient
            document.body.appendChild(script)
        } else {
            initGoogleClient()
        }
    }, [])

    function initGoogleClient() {
        // Initialize only once
        if (tokenClientRef.current) return

        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            callback: (tokenResponse) => {
                google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleGoogleLogin,
                    auto_select: true,
                })
                google.accounts.id.prompt()
            },
        })
    }

    async function handleGoogleLogin(credentialResponse) {
        try {
            const decoded = jwtDecode(credentialResponse.credential)
            const googleUser = {
                username: decoded.email,
                fullname: decoded.name,
                imgUrl: decoded.picture,
                password: decoded.sub,
            }
            await onLogin(googleUser, modalTypeRef.current)
        } catch (err) {
            console.error("Google login failed:", err)
            showErrorMsg("Google login failed. Please try again.")
        }
    }

    const handleLoginClick = () => {
        // Step 1: Force account selection
        if (!tokenClientRef.current) return showErrorMsg("Google client not loaded yet. Please close the window and try again.")
        tokenClientRef.current.requestAccessToken({ prompt: "select_account" })
    }

    return (
        <button onClick={handleLoginClick} className="btn google">
            <span className="logo">{logoSvgs.google}</span>
            {children}</button>
    )
}

