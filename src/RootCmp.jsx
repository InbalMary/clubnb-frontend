import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'

import { StayIndex } from './pages/StayIndex.jsx'
import { MsgIndex } from './pages/MsgIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { HostDetails } from './pages/HostDetails.jsx'

import { StayDetails } from './pages/StayDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup, Login, Signup } from './cmps/LoginSignup.jsx'
import { BecomeHostForm } from './pages/BecomeHostForm.jsx'
import { ListingEdit } from './pages/ListingEdit.jsx'
import { CompactHeader } from './cmps/CompactHeader.jsx'
import { useClickOutside } from './customHooks/useClickOutside.js'
import { StayEdit } from './pages/StayEdit.jsx'
import { ConfirmPay } from './pages/ConfirmPay.jsx'


export function RootCmp() {
    const location = useLocation()
    const [isExpanded, setIsExpanded] = useState(true)
    const [hasScrolled, setHasScrolled] = useState(false)
    const [initialModal, setInitialModal] = useState(null)
    const headerRef = useRef(null)
    const prevPathRef = useRef(location.pathname)

    const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3

    useEffect(() => {
        if (isStayDetailsPage) {
            if (!initialModal) setIsExpanded(false)
            return
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > 10 && !hasScrolled) {
                setHasScrolled(true)
            }

            if (currentScrollY > 50 && isExpanded && !initialModal) {
                setIsExpanded(false)
            } else if (currentScrollY <= 10 && !isExpanded && !initialModal) {
                setIsExpanded(true)
                setHasScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isExpanded, initialModal, isStayDetailsPage, hasScrolled])

    useClickOutside([headerRef], () => {
        if (isExpanded && initialModal) handleCollapse()
    })

    const handleSearchClick = (modalType) => {
        setInitialModal(modalType)
        setIsExpanded(true)
    }

    const handleCollapse = () => {
        if (isStayDetailsPage && initialModal) {
            setInitialModal(null)
            setIsExpanded(false)
            return
        }

        if (!hasScrolled) return

        if (window.scrollY <= 10) return setIsExpanded(false)
        setInitialModal(null)
        setIsExpanded(false)
    }

    return (
        <div className="main-container">
            {!isExpanded ? (
                <CompactHeader onSearchClick={handleSearchClick} isSticky={!isStayDetailsPage} />
            ) : (
                <AppHeader initialModal={initialModal} onCollapse={handleCollapse} />
            )}
            {/* <AppHeader /> */}
            <UserMsg />

            <main>
                <Routes>
                    {/* <Route path="" element={<HomePage />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                    <Route path="" element={<StayIndex />} />
                    <Route path="stay/edit" element={<StayEdit />} />
                    <Route path="stay/edit/:stayId" element={<StayEdit />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="stay/:stayId/confirm-pay" element={<ConfirmPay />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="messages" element={<MsgIndex />} />
                    {/* <Route path="chat" element={<ChatApp />} /> */}
                    <Route path="become-a-host" element={<BecomeHostForm />} />
                    <Route path="become-a-host/add-listing-about" element={<ListingEdit />} />
                    <Route path="host" element={<HostDetails />} />

                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


