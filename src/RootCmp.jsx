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
import { useHeaderState } from './customHooks/useHeaderState.js'

export function RootCmp() {
    const {
        isExpanded,
        initialModal,
        showBackdrop,
        isStayDetailsPage,
        headerRef,
        handleSearchClick,
        handleCollapse
    } = useHeaderState()

    useClickOutside([headerRef], () => {
        if (isExpanded && initialModal) handleCollapse()
    })

    return (
        <div className="main-container">
            {showBackdrop && <div className="backdrop" onClick={handleCollapse} />}
            <div ref={headerRef}>
                {!isExpanded ? (
                    <CompactHeader onSearchClick={handleSearchClick} isSticky={!isStayDetailsPage} />
                ) : (
                    <AppHeader initialModal={initialModal} onCollapse={handleCollapse} />
                )}
            </div>
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


