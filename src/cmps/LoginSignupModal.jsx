import { Modal } from './Modal'
import { ImgUploader } from './ImgUploader'
import { useState, useEffect } from 'react'

import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { useLocation, useNavigate } from 'react-router'
import { FancyButton } from './SmallComponents'
import { useSelector } from 'react-redux'
import { useScrollLock } from '../customHooks/useScrollLock'


export function LoginSignupModal({ isOpen, onClose }) {

    const [modalType, setModalType] = useState('login')
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)
    const [guestUser, setGuestUser] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()
    const isSignup = location.pathname.includes('signup')

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

    async function onLogin(credentials) {
        try {
            if (isSignup) {
                await signup(credentials)
                showSuccessMsg('Signed in successfully')
            } else {
                await login(credentials)
                showSuccessMsg('Logged in successfully')
            }
            clearState()
            onClose()
            navigate('/')
        } catch (err) {
            const msg = isSignup
                ? 'Had a problem signing up'
                : 'Had a problem logging in'
            showErrorMsg(msg)
            console.error('Login error:', err)
        }
    }

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
            showSuccessMsg('Logged in successfully')
            onClose()
            navigate('/')

        } catch (err) {
            showErrorMsg('Had problem logging guest')
            console.error('Login error:', err)
        }

    }

    function handleToggleType() {
        setModalType(prev => (prev === 'login' ? 'signup' : 'login'))
    }

    return (

        <Modal
            header="Log in or sign up"
            isOpen={isOpen}
            onClose={onClose}
            closePosition='left'
            useBackdrop={true}
            className='login-signup-modal'
        >
            <h2>Welcome to Clubnb</h2>
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
                <button onClick={onGuestLogin} className="btn">Login as a guest</button>
             
            </div>

        </Modal >
    )

}
