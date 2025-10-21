import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function useHeaderState() {
    const location = useLocation()
    const [isExpanded, setIsExpanded] = useState(true)
    const [hasScrolled, setHasScrolled] = useState(false)
    const [initialModal, setInitialModal] = useState(null)
    const headerRef = useRef(null)
    const prevPathRef = useRef(location.pathname)

    const isStayDetailsPage = location.pathname.startsWith('/stay/') && location.pathname.split('/').length === 3
    const isStayEditPage = location.pathname.startsWith('/stay/edit/')
    const isIndexPage = location.pathname === '/'
    const isConfirmPayPage = location.pathname.includes('/confirm')
    const isTripsPage = location.pathname === '/trips'
    const isHostPage = location.pathname.includes("hosting")
    const isExplorePage = location.pathname.startsWith("/explore/")
    const isWishlistPage = location.pathname.startsWith("/wishlist")

    const showBackdrop = (isExpanded && initialModal) || (isStayDetailsPage && isExpanded)

    // Scroll to top on route change (general)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [location.pathname])

    // Handle route changes
    useEffect(() => {
        const prevPath = prevPathRef.current

        if (prevPath !== '/' && isIndexPage) {
            setIsExpanded(true)
            setHasScrolled(false)
        } else if (isTripsPage || isWishlistPage || isHostPage || isExplorePage || isStayEditPage) {
            setIsExpanded(false)
            setHasScrolled(true)
        } else {
            setHasScrolled(false)
        }

        setInitialModal(null)
        prevPathRef.current = location.pathname
    }, [location.pathname, isIndexPage, isTripsPage, isHostPage, isExplorePage, isStayEditPage])

    // Handle scroll behavior
    useEffect(() => {
        if (isStayDetailsPage || isStayEditPage || isTripsPage || isWishlistPage || isHostPage || isExplorePage) {
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
    }, [isExpanded, initialModal, isStayDetailsPage, isStayEditPage, isTripsPage, isWishlistPage, isHostPage, isExplorePage, hasScrolled])

    const handleSearchClick = (modalType) => {
        setInitialModal(modalType)
        setIsExpanded(true)
    }

    const handleCollapse = () => {
        if ((isStayDetailsPage || isStayEditPage) && initialModal) {
            setInitialModal(null)
            setIsExpanded(false)
            return
        }

        if (!hasScrolled) return

        if (window.scrollY <= 10) return setIsExpanded(false)
        setInitialModal(null)
        setIsExpanded(false)
    }

    return {
        isExpanded,
        initialModal,
        showBackdrop,
        isStayDetailsPage,
        isStayEditPage,
        isConfirmPayPage,
        isTripsPage,
        isWishlistPage,
        headerRef,
        handleSearchClick,
        handleCollapse
    }
}