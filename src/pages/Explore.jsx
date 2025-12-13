import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'
import { useClickOutside } from '../customHooks/useClickOutside'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { Modal } from '../cmps/Modal'
import { svgControls } from '../cmps/Svgs'
import { LoginSignupModal } from '../cmps/LoginSignupModal'
import { getTruthyValues } from '../services/util.service'

export function Explore() {
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const filterBy = useSelector(storeState => storeState.stayModule.filterBy)

    const wm = useWishlistModal(wishlists)
    const { city } = useParams()
    const [searchParams] = useSearchParams()
    const [hoveredId, setHoveredId] = useState(null)
    const [focusedStayId, setFocusedStayId] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 743)
    const [drawerSnap, setDrawerSnap] = useState('mid')

    const previewRef = useRef(null)
    const drawerRef = useRef(null)
    const dragStartYRef = useRef(null) //finger start touch
    const drawerStartYRef = useRef(0) //drawer start pos
    const currentDrawerYRef = useRef(0) //updated drawer pos

    useClickOutside([previewRef], () => {
        setFocusedStayId(null)
    })
    const [showMap, setShowMap] = useState(false)
    const [isToggleRange, setIsToggleRange] = useState(
        window.innerWidth <= 949 && window.innerWidth >= 744
    )

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth
            setIsMobile(width <= 743)
            setIsToggleRange(width <= 949 && width >= 744)
            //desktop
            if (width > 949) setShowMap(true)
            //tablet
            if (width >= 744 && width <= 949) {
                setShowMap(false)
            }
            //Mobile
            if (width <= 743) setShowMap(true)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!isMobile) {
            dragStartYRef.current = null
            currentDrawerYRef.current = 0

            if (drawerRef.current) {
                drawerRef.current.style.transform = 'none'
            }
        }
    }, [isMobile])

    function onPointerDown(ev) {
        ev.currentTarget.setPointerCapture(ev.pointerId)
        dragStartYRef.current = ev.clientY
        drawerStartYRef.current = currentDrawerYRef.current
        drawerRef.current.style.transition = 'none'
    }

    function onPointerMove(ev) {
        if (dragStartYRef.current === null) return
        const delta = ev.clientY - dragStartYRef.current

        //enable scroll if drawer is full and user scrolls upward
        if (currentDrawerYRef.current === 0 && delta < 0) return

        let newY = drawerStartYRef.current + delta
        const vh = window.innerHeight
        const minY = 0 //don't drag above top
        const maxY = vh * 0.78

        if (newY < minY) newY = minY
        if (newY > maxY) newY = maxY
        drawerRef.current.style.transform = `translateY(${newY}px)`
        currentDrawerYRef.current = newY
    }

    function onPointerUp(ev) {
        ev.currentTarget.releasePointerCapture(ev.pointerId)
        dragStartYRef.current = null

        const currentY = currentDrawerYRef.current //where the drawer stopped
        const snapPoints = getSnapPoints()

        let closestKey = null
        let smallestDistance = Infinity

        for (const key in snapPoints) {
            const snapY = snapPoints[key]
            const distance = Math.abs(currentY - snapY)
            if (distance < smallestDistance) {
                smallestDistance = distance
                closestKey = key
            }
        }
        const targetY = snapPoints[closestKey]
        const drawer = drawerRef.current
        drawer.style.transition = 'transform 0.25s ease'
        drawer.style.transform = `translateY(${targetY}px)`
        currentDrawerYRef.current = targetY

        setDrawerSnap(closestKey)
    }

    function getSnapPoints() {
        const vh = window.innerHeight
        return {
            full: 0,
            mid: vh * 0.40,
            collapsed: vh * 0.78
        }
    }

    const showMobileMapToggle = isMobile && drawerSnap === 'full'

    function onShowMapFromDrawer() {
        const { collapsed } = getSnapPoints()
        setShowMap(true)
        setDrawerSnap('collapsed')

        if (drawerRef.current) {
            drawerRef.current.scrollTop = 0
        }

        currentDrawerYRef.current = collapsed
        drawerStartYRef.current = collapsed
        dragStartYRef.current = null

        if (drawerRef.current) {
            drawerRef.current.style.transition = 'transform 0.25s ease'
            drawerRef.current.style.transform = `translateY(${collapsed}px)`
        }
    }

    // if (!type || city) return <ExploreSkeleton stays={stays} />
    // if (stays) return<div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

    useEffect(() => {
        console.count('explore render')

        const destination = searchParams.get('destination') || null
        const startDate = searchParams.get('startDate') || null
        const endDate = searchParams.get('endDate') || null
        const adults = searchParams.get('adults') || null
        const children = searchParams.get('children') || null
        const infants = searchParams.get('infants') || null
        const pets = searchParams.get('pets') || null

        // prefer explicit adult/child counts instead of a single totalGuests
        const filterParams = getTruthyValues({
            destination: filterBy?.destination ?? (destination || null),
            city: city || null,
            startDate,
            endDate,
            adults: adults ? Number(adults) : null,
            children: children ? Number(children) : null,
            infants: infants ? Number(infants) : null,
            pets: pets ? Number(pets) : null,
        })


        // const totalGuests = (adults || children)
        //     ? (parseInt(adults || 0) + parseInt(children || 0))
        //     : null

        // const filterParams = {
        //     city: city || null,
        //     startDate,
        //     endDate,
        //     guests: totalGuests  // sends the actual number of guests..
        // }

        // console.log('Loading stays with filter:', filterParams)
        loadStays(filterParams)

    }, [city, searchParams])


    const filteredStays = stays?.filter(stay => {
        if (stay.summary?.includes('[IN_PROGRESS:')) {
            return false
        }

        const adultsParam = searchParams.get('adults')
        const childrenParam = searchParams.get('children')

        if (adultsParam || childrenParam) {
            const requestedGuests = parseInt(adultsParam || 0) + parseInt(childrenParam || 0)
            const stayCapacity = stay.capacity || stay.guests || 0

            console.log(`Stay ${stay.name}: capacity=${stayCapacity}, requested=${requestedGuests}`)

            if (stayCapacity < requestedGuests) {
                return false
            }
        }

        return true
    })

    return (
        <section className={`explore-page full ${!isMobile && showMap ? 'map-open' : ''}`}>
            {isLoading ? (
                <div className="loading-overlay">
                    <ExploreSkeleton stays={stays} />
                </div>
            ) : (
                <>
                    {isMobile && showMobileMapToggle && (
                        <button
                            className="toggle-map-btn mobile-toggle btn btn-black btn-pill"
                            onClick={onShowMapFromDrawer}
                        >
                            <>Map {svgControls.map}</>
                        </button>
                    )}
                    {isToggleRange && !isMobile && (
                        <button className='toggle-map-btn btn btn-black btn-pill' onClick={() => setShowMap(prev => !prev)}>
                            {showMap ? (
                                <>Show list {svgControls.list}</>
                            ) : (
                                <>Show map {svgControls.map}</>
                            )}
                        </button>
                    )}
                    {(!showMap || !isToggleRange) && (
                        <div className="explore-items-wrapper">
                            <div className={`items-wrapper drawer ${drawerSnap === 'full' ? 'can-scroll' : ''}`} ref={drawerRef}>

                                <div
                                    className="drawer-top"
                                    onPointerDown={isMobile ? onPointerDown : undefined}
                                    onPointerMove={isMobile ? onPointerMove : undefined}
                                    onPointerUp={isMobile ? onPointerUp : undefined}
                                >
                                    <div className="drag-handle">
                                        <h4 className='explore-title'>Over {filteredStays?.length || 0} homes in {city}</h4>
                                    </div>
                                </div>
                                {/* grid of stays */}

                                <div className="explore-grid">
                                    {filteredStays?.map(stay => (
                                        <div
                                            className="div-for-focus"
                                            key={stay._id}
                                            onMouseEnter={() => setHoveredId(stay._id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            tabIndex={0}
                                        >
                                            <StayPreview
                                                stay={stay}
                                                isBig={true}
                                                onToggleWishlist={wm.onToggleWishlist}
                                                isFocused={focusedStayId === stay._id}
                                                // onRequestFocus={() => setFocusedStayId(stay._id)}
                                                onRequestFocus={() => {
                                                    // console.log('Focus requested for', stay._id)
                                                    setFocusedStayId(stay._id)
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {(showMap || !isToggleRange) && (
                        <ExploreMap
                            tabIndex={0}
                            locations={filteredStays}
                            hoveredId={hoveredId}
                            onToggleWishlist={wm.onToggleWishlist}
                        />
                    )}
                </>
            )
            }
            {
                wm.isWishlistModalOpen && wm.activeStay && (
                    <Modal
                        header="Save to wishlist"
                        isOpen={wm.isWishlistModalOpen}
                        onClose={() => wm.setIsWishlistModalOpen(false)}
                        closePosition="right"
                        className="wishlist-modal"
                        footer={
                            <button className='create-wishlist-btn'
                                onClick={() => {
                                    wm.setIsWishlistModalOpen(false)
                                    wm.setNewTitle(`${wm.activeStay.loc.city}, ${wm.activeStay.loc.country} ${new Date().getFullYear()}`)
                                    wm.setShowInputClearBtn(true)
                                    wm.setIsCreateWishlistModalOpen(true)
                                }}
                            >
                                Create new wishlist
                            </button>
                        }
                    >
                        <ul className='wishlist-modal-list'>
                            {wishlists.map(wishlist => (
                                <li
                                    key={wishlist._id}
                                    onClick={() => wm.onSelectWishlistFromModal(wishlist)}
                                >
                                    <img src={wishlist.stays?.[0].imgUrls?.[0]} alt={wishlist.title} className="wishlist-modal-img" />
                                    <span className="stay-name">{wishlist.title}</span>
                                </li>
                            ))}
                        </ul>

                    </Modal>
                )
            }
            {
                wm.isCreateWishlistModalOpen && (
                    <Modal
                        header={
                            <>
                                <button className='btn btn-transparent btn-round back'
                                    onClick={() => {
                                        wm.setIsCreateWishlistModalOpen(false)
                                        if (wishlists.length) wm.setIsWishlistModalOpen(true)
                                    }}
                                >
                                    {svgControls.backArrow}
                                </button>
                                <span className='creat-wishlist-modal-title'>
                                    {wishlists.length === 0
                                        ? 'Create your first wishlist'
                                        : 'Create wishlist'}
                                </span>
                            </>
                        }
                        isOpen={wm.isCreateWishlistModalOpen}
                        onClose={() => {
                            wm.setIsCreateWishlistModalOpen(false)
                            if (wishlists.length) wm.setIsWishlistModalOpen(true)
                        }}
                        className="create-wishlist-modal"
                        showCloseBtn={false}
                        footer={
                            <div className="create-footer-actions">
                                <button className='btn create-cancel-btn btn-transparent'
                                    onClick={() => {
                                        wm.setIsCreateWishlistModalOpen(false)
                                        if (wishlists.length) wm.setIsWishlistModalOpen(true)
                                    }}>
                                    Cancel
                                </button>
                                <button className='btn create-btn btn-black'
                                    onClick={wm.onCreateWishlist}>
                                    Create
                                </button>
                            </div>
                        }
                    >
                        <div className="rename-input-wrapper">
                            <input
                                className="rename-input"
                                type="text"
                                value={wm.newTitle}
                                onChange={(ev) => {
                                    wm.setNewTitle(ev.target.value)
                                    wm.setShowInputClearBtn(ev.target.value !== '')
                                }}
                                placeholder="Name your wishlist"
                            />
                            {wm.newTitle && (
                                <button
                                    type="button"
                                    className="btn btn-gray btn-round clear-input-btn"
                                    onClick={() => {
                                        wm.setNewTitle('')
                                        wm.setShowInputClearBtn(false)
                                    }}
                                >
                                    {svgControls.closeModal}
                                </button>
                            )}
                        </div>
                    </Modal>
                )
            }
            {
                wm.isSignupModalOpen && (
                    <LoginSignupModal
                        isOpen={wm.isSignupModalOpen}
                        onClose={() => wm.setIsSignupModalOpen(false)}
                        title={wm.signupModalProps.title}
                        subtitle={wm.signupModalProps.subtitle}
                        onLoginSuccess={() => {
                            console.log('Login success from Explore, calling post-login flow')
                            wm.handlePostLoginFlow()
                        }}
                        isFromWishlist={true}
                    />
                )
            }

        </section >

    )
}

