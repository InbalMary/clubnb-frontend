import { useEffect, useState } from 'react'
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


export function RootCmp() {
    const location = useLocation()
    const [isExpanded, setIsExpanded] = useState(true)
    const [initialModal, setInitialModal] = useState(null)

    const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3

    useEffect(() => {
        if (isStayDetailsPage) {
            if (!initialModal) setIsExpanded(false)
            return
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > 50 && isExpanded && !initialModal) {
                setIsExpanded(false)
            } else if (currentScrollY <= 10 && !isExpanded && !initialModal) {
                setIsExpanded(true)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isExpanded, initialModal, isStayDetailsPage])

    const handleSearchClick = (modalType) => {
        setInitialModal(modalType)
        setIsExpanded(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCollapse = () => {
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
                    <Route path="stay/:stayId" element={<StayDetails />} />
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


