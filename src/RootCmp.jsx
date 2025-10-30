import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'

import { loadWishlists } from './store/actions/wishlist.actions.js'
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
import { useClickOutside } from './customHooks/useClickOutside.js'
import { StayEdit } from './pages/StayEdit.jsx'
import { ConfirmPay } from './pages/ConfirmPay.jsx'
import { useHeaderState } from './customHooks/useHeaderState.js'
import { TripIndex } from './pages/TripIndex.jsx'
import { ReservationsPage } from './pages/ReservationsPage.jsx'
import { ListingsPage } from './pages/ListingsPage.jsx'
import { Explore } from './pages/Explore.jsx'
import { WishlistIndex } from './pages/WishlistIndex.jsx'
import { WishlistDetails } from './pages/WishlistDetails.jsx'
import { HostDashboard } from './pages/HostDashboard.jsx'

export function RootCmp() {
    const {
        isIndexPage,
        isExpanded,
        initialModal,
        showBackdrop,
        isStayDetailsPage,
        isConfirmPayPage,
        isTripsPage,
        isWishlistPage,
        isWishlistDetailsPage,
        headerRef,
        handleSearchClick,
        handleCollapse
    } = useHeaderState()

    useClickOutside([headerRef], () => {
        if (isExpanded && initialModal) handleCollapse()
    })
    useEffect(() => {
        const user = userService.getLoggedinUser()
        if (user?._id) {
            loadWishlists(user._id)
        } else {
            console.log('Skipping wishlist load — no user logged in')
        }
    }, [])


    return (
        <div>
            {showBackdrop && <div className="backdrop" onClick={handleCollapse} />}
            {!isConfirmPayPage && (
                <div ref={headerRef}>
                    <AppHeader
                        isCompact={!isExpanded}
                        onSearchClick={handleSearchClick}
                        initialModal={initialModal}
                        onCollapse={handleCollapse}
                        isSticky={!isStayDetailsPage}
                        isTripsPage={isTripsPage}
                        isWishlistPage={isWishlistPage}
                        isWishlistDetailsPage={isWishlistDetailsPage}
                    />
                </div>
            )}
            <UserMsg />
            <main className="main-container">
                <Routes>
                    <Route path="" element={<StayIndex />} />
                    <Route path="explore/city/:city" element={<Explore />} />
                    <Route path="stay/edit" element={<StayEdit />} />
                    <Route path="stay/edit/:stayId" element={<StayEdit />} />
                    <Route path="stay/edit/become-a-host" element={<StayEdit />} />
                    <Route path="stay/edit/:id/about-your-place" element={<StayEdit />} />
                    <Route path="stay/edit/:id/structure" element={<StayEdit />} />
                    <Route path="stay/edit/:id/privacy-type" element={<StayEdit />} />
                    <Route path="stay/edit/:id/location" element={<StayEdit />} />
                    <Route path="stay/edit/:id/address-details" element={<StayEdit />} />
                    <Route path="stay/edit/:id/confirm-location" element={<StayEdit />} />
                    <Route path="stay/edit/:id/floor-plan" element={<StayEdit />} />
                    <Route path="stay/edit/:id/stand-out" element={<StayEdit />} />
                    <Route path="stay/edit/:id/amenities" element={<StayEdit />} />
                    <Route path="stay/edit/:id/photos" element={<StayEdit />} />
                    <Route path="stay/edit/:id/title" element={<StayEdit />} />
                    <Route path="stay/edit/:id/description" element={<StayEdit />} />
                    <Route path="stay/edit/:id/finish-intro" element={<StayEdit />} />
                    <Route path="stay/edit/:id/price" element={<StayEdit />} />


                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="stay/:stayId/confirm-pay" element={<ConfirmPay />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="trips" element={<TripIndex />} />
                    <Route path="wishlists" element={<WishlistIndex />} />
                    <Route path="wishlists/:id" element={<WishlistDetails />} />
                    <Route path="messages" element={<MsgIndex />} />
                    {/* <Route path="chat" element={<ChatApp />} /> */}
                    <Route path="hosting" element={<BecomeHostForm />} />
                    <Route path="hosting/reservations" element={<ReservationsPage />} />
                    <Route path="hosting/listings" element={<ListingsPage />} />
                    <Route path="hosting/dashboard" element={<HostDashboard />} />
                    <Route path="hosting/add-listing-about" element={<ListingEdit />} />
                    <Route path="host" element={<HostDetails />} />

                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <AppFooter
                isIndexPage={isIndexPage}
                isStayDetailsPage={isStayDetailsPage} />
        </div>
    )
}


