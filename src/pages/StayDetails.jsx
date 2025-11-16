import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay } from '../store/actions/stay.actions'

import { amenitiesSvg, svgControls } from '../cmps/Svgs'
import { LongTxt } from '../cmps/LongTxt'
import { Modal } from '../cmps/Modal'
import { DateRangePicker } from '../cmps/DateRangePicker'
import { StayRating } from '../cmps/StayRating'
import { StayReviewList } from '../cmps/StayReviewList'
import { AmenitiesLongList, AmenitiesShortList, BigRating, CalendarStayDates, Capacity, DetailsSkeleton, Highlights, MiniHost, MiniStickyContainer, SleepingRooms, SmallRating, StayImgs } from '../cmps/SmallComponents'
import { getAmenitiesData } from '../services/stay/stay.service.local'
import { StickyContainer } from '../cmps/StickyContainer'
import { HostInfo } from '../cmps/HostInfo'
import { StayMap } from '../cmps/StayMap'
import { StayHeader } from '../cmps/StayHeader'
import { useDateRange } from '../customHooks/useDateRange'
import { WishlistModal } from '../cmps/WishListModal'
import { useIsBreakPoint } from '../customHooks/useIsBreakPoint'
import { setCurrentOrder } from '../store/actions/order.actions'
import { calculateNights, getTruthyValues, toUrlDate } from '../services/util.service'
import { ShareModal } from '../cmps/ShareModal'
import { useWishlistModal } from '../customHooks/useWishlistModal'
import { LoginSignupModal } from '../cmps/LoginSignupModal'

export function StayDetails() {
  console.count('StayDetails render')
  const [searchParams, setSearchParams] = useSearchParams()
  const { stayId } = useParams()

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const adults = searchParams.get('adults')
  const children = searchParams.get('children')
  const infants = searchParams.get('infants')
  const pets = searchParams.get('pets')

  const stay = useSelector(storeState => storeState.stayModule.stay)
  const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)
  const filterBy = useSelector(storeState => storeState.stayModule.filterBy)
  const isLoading = useSelector(storeState => storeState.stayModule.isLoading)


  const wm = useWishlistModal(wishlists)

  const { dateRange, setDateRange } = useDateRange()
  const [modalType, setModalType] = useState(null)
  const [selectedReviewIdx, setSelectedReviewIdx] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  // const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)

  const reviewRefs = useMemo(() => stay?.reviews?.map(() => createRef()), [stay?.reviews])
  const amenitiesData = getAmenitiesData(amenitiesSvg, stay?.amenities)

  const isMobile = useIsBreakPoint(744);
  const isMiddle = useIsBreakPoint(1127);
  const isBigLayout = useIsBreakPoint(1600)
  const isCalendarBreakPoint = useIsBreakPoint(1220)
  const navigate = useNavigate()


  const [guests, setGuests] = useState(() => {
    const adults = searchParams.get('adults')
    const children = searchParams.get('children')
    const infants = searchParams.get('infants')
    const pets = searchParams.get('pets')
    const minAdults = stayId ? 1 : 0
    return {
      adults: adults ? Number(adults) : minAdults,
      children: children ? Number(children) : 0,
      infants: infants ? Number(infants) : 0,
      pets: pets ? Number(pets) : 0,
    }
  })

  const [userCleared, setUserCleared] = useState(false)

  useEffect(() => {
    if (userCleared) return

    if (startDate && endDate) {
      setDateRange({ from: new Date(startDate), to: new Date(endDate) })
      setUserCleared(false)
    }

    if (adults || children || infants || pets) {

      setGuests({
        adults: filterBy.adults || parseInt(adults) || 1,
        children: filterBy.children || parseInt(children) || 0,
        infants: filterBy.infants || parseInt(infants) || 0,
        pets: filterBy.pets || parseInt(pets) || 0,
      })
    }

  }, [startDate, endDate, adults,
    children,
    infants,
    pets])

  useEffect(() => {
    // merge local dateRange/guests into existing URL params (do not clobber other keys)
    const timeout = setTimeout(() => {
      // read current live search params from location so we don't
      //  depend on the hook value and cause loops
      const merged = new URLSearchParams(window.location.search)

      const formattedFrom = dateRange?.from ? toUrlDate(dateRange.from) : null
      const formattedTo = dateRange?.to ? toUrlDate(dateRange.to) : null

      if (formattedFrom) merged.set('startDate', formattedFrom)
      else if (userCleared) merged.delete('startDate')

      if (formattedTo) merged.set('endDate', formattedTo)
      else if (userCleared) merged.delete('endDate')

      const setOrDelete = (key, value) => {
        if (value != null && value !== '' && Number(value) > 0) merged.set(key, String(value))
        else if (userCleared) merged.delete(key)
      }

      setOrDelete('adults', guests?.adults)
      setOrDelete('children', guests?.children)
      setOrDelete('infants', guests?.infants)
      setOrDelete('pets', guests?.pets)

      const newString = merged.toString()
      // only write if changed
      if (newString !== (new URLSearchParams(window.location.search)).toString()) {
        setSearchParams(merged, { replace: true })
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [dateRange, guests, userCleared])

  function handleOnClear() {
    setUserCleared(true)
    setDateRange({ from: null, to: null })
    const params = new URLSearchParams(searchParams)
    params.delete('startDate')
    params.delete('endDate')
    setSearchParams(params, { replace: true })
  }

  useEffect(() => {
    //  if (stayId) {

    loadStay(stayId)
    //  }
  }, [stayId])


  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isLoading])


  const isAddedToWishlist = stay?._id && Array.isArray(wishlists)
    ? wishlists.some(wl =>
      Array.isArray(wl.stays) &&
      wl.stays.some(stayInList => stayInList?._id === stay._id)
    )
    : false

  // async function onToggleWishlist(ev) {
  //   ev.stopPropagation()
  //   try {
  //     if (isAddedToWishlist) {
  //       const wishlistWithStay = wishlists.find(wishlist =>
  //         wishlist.stays.some(stayInList => stayInList._id === stay._id)
  //       )
  //       if (wishlistWithStay) {
  //         if (wishlistWithStay.stays.length === 1) {
  //           await removeWishlist(wishlistWithStay._id)
  //           showSuccessMsg(`Wishlist ${wishlistWithStay.title} deleted`, stay.imgUrls?.[0])
  //         } else {
  //           await removeStayFromWishlist(wishlistWithStay, stay._id)
  //           showSuccessMsg(`Removed from wishlist ${wishlistWithStay.title}`, stay.imgUrls?.[0])
  //         }
  //       }
  //     } else {
  //       setIsWishlistModalOpen(true)
  //     }
  //   } catch (err) {
  //     console.error('Error toggling wishlist:', err)
  //     showErrorMsg('Could not update wishlist, please try again.')
  //   }
  // }

  const refs = {
    photoRef: useRef(null),
    amenitiesRef: useRef(null),
    reviewRef: useRef(null),
    locationRef: useRef(null),
    stickyContainerRef: useRef(null),
    calendarRef: useRef(null)
  }

  const handleDateComplete = (newRange) => {
    if (newRange?.from && newRange?.to) {
      setDateRange(newRange)
    }
  }


  function handleShowMoreClick(index) {
    setSelectedReviewIdx(index)
    setModalType('reviews')
  }

  useEffect(() => {
    if ((modalType === 'reviews') && selectedReviewIdx !== null) {
      const ref = reviewRefs[selectedReviewIdx]
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
        setSelectedReviewIdx(null)
      }
    }

  }, [modalType, selectedReviewIdx, reviewRefs])


  function getGuestsFromParams(params) {
    return {
      adults: Number(params.get('adults')),
      children: Number(params.get('children')),
      infants: Number(params.get('infants')),
      pets: Number(params.get('pets')),
    }
  }


  function handleClick() {
    const scrollToSection = (ref) => {
      const el = ref.current
      if (!el) return

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    const from = startDate
    const to = endDate

    if (from && to) {
      const numNights = calculateNights(from, to)
      const pricePerNight = stay.price
      const cleaningFee = stay.cleaningFee || 0
      const serviceFee = Math.round(pricePerNight * 0.1)

      const order = {
        stay,
        host: stay.host,
        startDate: from,
        endDate: to,
        guests,
        numNights,
        pricePerNight,
        cleaningFee,
        serviceFee,
        totalPrice: numNights * pricePerNight
      }
      setCurrentOrder(order)
      navigate(`/stay/${stay._id}/confirm-pay`, { state: { order } })
    } else {
      isMobile ? scrollToSection(refs.calendarRef) :
        scrollToSection(refs.stickyContainerRef)
    }
  }

  function handleShare() {
    const shareData = {
      title: stay.name,
      text: `Check out this stay on ClubNB: ${stay.name}!`,
      url: window.location.href,
    }

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.log("Share canceled", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard ✅")
    }
  }

  if (!stay) return <div className="loading-overlay"><DetailsSkeleton />  </div>

  return (
    <section className={`stay-details ${isMiddle ? 'mobile' : 'main-container'} 
    ${isBigLayout ? 'big-layout' : ''}`}>

      {(!stay || isLoading) && (
        <div className="loading-overlay">
          <DetailsSkeleton />
        </div>
      )}

      <div className="main-content">

        {isMobile ? (

          <div className="btns-mobile-wrapper">

            <button onClick={() => navigate('/')} className='btn-back mobile'>
              {svgControls.backArrow1}
            </button>
            <div className="flex">
              <button onClick={handleShare} className="share-btn mobile">
                {svgControls.share}
              </button>
              <button className="save-heart-btn mobile" onClick={() => wm.onToggleWishlist(stay)}>
                <span className={`heart-icon ${isAddedToWishlist ? 'active' : ''}`}>{svgControls.heart}
                </span>
              </button>
            </div>
          </div>

        ) : (

          <div className="share-wishlist flex justify-between">
            <h1 ref={refs.photoRef}>{stay?.name}</h1>
            <div className="share-btns-container flex">

              <button onClick={() => setIsShareModalOpen(true)} className="share-btn">
                <span className="share-icon">{svgControls.share}<span className="link">Share</span></span>
              </button>
              <button className="save-heart-btn" onClick={() => wm.onToggleWishlist(stay)}>
                {/* <button className="save-heart-btn" onClick={onToggleWishlist}> */}
                <span className={`heart-icon ${isAddedToWishlist ? 'active' : ''}`}>{svgControls.heart}
                  <span className="link">{isAddedToWishlist ? 'Saved' : 'Save'}</span>
                </span>
              </button>
            </div>
          </div>
        )}
        <ShareModal stay={stay} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onClick={handleShare} />
        {wm.isWishlistModalOpen && wm.activeStay && (
          <Modal
            header="Save to wishlist"
            isOpen={wm.isWishlistModalOpen}
            onClose={() => wm.setIsWishlistModalOpen(false)}
            closePosition="right"
            className="wishlist-modal"
            footer={
              <button
                className='create-wishlist-btn'
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
                <li key={wishlist._id} onClick={() => wm.onSelectWishlistFromModal(wishlist)}>
                  <img
                    src={
                      wishlist?.stays?.[0]?.imgUrls?.[0] ||
                      "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/578a39ea-267c-4f72-82ec-5e80156e7ee5.jpeg?im_w=480"
                    }
                    alt={wishlist.title}
                    className="wishlist-modal-img"
                  />
                  <span className="stay-name">{wishlist.title}</span>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {wm.isCreateWishlistModalOpen && (
          <Modal
            header={
              <>
                <button
                  className='btn btn-transparent btn-round back'
                  onClick={() => {
                    wm.setIsCreateWishlistModalOpen(false)
                    if (wishlists.length) wm.setIsWishlistModalOpen(true)
                  }}
                >
                  {svgControls.backArrow}
                </button>
                <span className='creat-wishlist-modal-title'>
                  {wishlists.length === 0 ? 'Create your first wishlist' : 'Create wishlist'}
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
                <button
                  className='btn create-cancel-btn btn-transparent'
                  onClick={() => {
                    wm.setIsCreateWishlistModalOpen(false)
                    if (wishlists.length) wm.setIsWishlistModalOpen(true)
                  }}
                >
                  Cancel
                </button>
                <button className='btn create-btn btn-black' onClick={wm.onCreateWishlist}>
                  Create
                </button>
              </div>
            }
          >
            <div className='rename-input-wrapper'>
              <input
                className='rename-input'
                type="text"
                value={wm.newTitle}
                onChange={(ev) => {
                  wm.setNewTitle(ev.target.value)
                  if (ev.target.value !== '') wm.setShowInputClearBtn(false)
                }}
                placeholder="Name your wishlist"
              />
              {wm.showInputClearBtn && wm.newTitle && (
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
        )}

        {wm.isSignupModalOpen && (
          <LoginSignupModal
            isOpen={wm.isSignupModalOpen}
            onClose={() => wm.setIsSignupModalOpen(false)}
            title={wm.signupModalProps.title}
            subtitle={wm.signupModalProps.subtitle}
            onLoginSuccess={wm.handlePostLoginFlow}
            isFromWishlist={true}
          />
        )}

        {/* <WishlistModal
          stay={stay}
          isOpen={isWishlistModalOpen}
          isAddedToWishlist={isAddedToWishlist}
          onClose={() => setIsWishlistModalOpen(false)}
        /> */}
        <StayImgs stay={stay} />

        <StayHeader refs={refs} stay={stay} onClick={handleClick} startDate={startDate} endDate={endDate} />
        <div className="details-container">
          <div className="content">

            <div className="first-block">
              <h2 className="stay-name">{stay?.roomType} in {stay?.loc?.city},  {stay?.loc?.country}</h2>
              <Capacity stay={stay} />
              <SmallRating readOnly={false} stay={stay} onClick={() => setModalType('reviews')} />
            </div>

            <div className="border"></div>

            <MiniHost stay={stay} />

            <div className="border"></div>

            <Highlights stay={stay} />

            <div className="border"></div>

            {stay?.summary &&
              <span className="summary">
                <LongTxt children={stay?.summary} length={250} />
                {stay?.summary.length > 250 &&
                  <button className={`open-modal ${isMobile && 'mobile'}`} onClick={() => setModalType('summary')}>
                    Show more
                  </button>
                }
              </span>}

            <div className="border"></div>

            <SleepingRooms stay={stay} />

            <div className="border"></div>

            <div ref={refs.amenitiesRef} className="amenities">
              {!!amenitiesData?.length &&
                <div className="amenities-container">
                  <h2>What this place offers</h2>
                  <AmenitiesShortList amenitiesData={amenitiesData} />

                  <button onClick={() => setModalType('amenities')} className={`open-modal ${isMobile && 'mobile'}`}>Show all {amenitiesData.length} amenities</button>
                </div>
              }
            </div>

            <Modal
              header=" "
              isOpen={modalType !== null}
              onClose={() => setModalType(null)}
              closePosition='left'
              className={`${modalType === 'reviews' ? 'reviews-rating-modal' : 'modal-popup'} ${isMiddle ? 'mid-layout' : ''} ${isMobile ? 'mobile' : ''}`}>

              {modalType === 'reviews' &&
                <div className="reviews-in-modal">
                  <StayRating reviews={stay.reviews} isModal={true} />
                  <StayReviewList reviewRefs={reviewRefs} reviews={stay.reviews} isModal={true} />
                </div>
              }

              {modalType === 'amenities' && (
                <>
                  <h2>What this place offers</h2>
                  <AmenitiesLongList amenitiesData={amenitiesData} />
                </>
              )
              }

              {modalType === 'summary' &&
                <>
                  <h1>About this place</h1>
                  {<div className="summary">
                    {stay.summary
                      .split('\n\n')
                      .filter(line => line.trim() !== '')
                      .map((line, idx) => (
                        <div>
                          <p key={idx}>{line.trim()}</p>
                          <br />
                        </div>
                      ))}
                  </div>}
                </>
              }
            </Modal>

            <div className="border"></div>

            <div
              ref={refs.calendarRef}
              className="details-calendar" >
              <CalendarStayDates stay={stay} startDate={startDate} endDate={endDate} />
              {isCalendarBreakPoint ? (
                <DateRangePicker
                  value={dateRange}
                  numberOfMonths={1}
                  onComplete={handleDateComplete}
                  activeField={"null"}
                />
              ) : (

                <DateRangePicker
                  value={dateRange}
                  numberOfMonths={2}
                  onComplete={handleDateComplete}
                  activeField={"null"}
                />
              )}
            </div>

          </div>


          {!isMobile &&
            <div ref={refs.stickyContainerRef} className="sticky-ref">
              <StickyContainer stay={stay}
                dateRange={dateRange}
                setDateRange={setDateRange}
                guests={guests}
                setGuests={setGuests}
                handleOnClear={handleOnClear}
              />
            </div>
          }

        </div>

        <div className="border"></div>

        {isMobile ? (
          <div className="review-section mobile">
            <BigRating reviews={stay?.reviews} />
            {!stay?.reviews?.length && <h2 className="no-reviews">No reviews yet...</h2>}
            <StayReviewList reviews={stay?.reviews} isModal={false} onClick={handleShowMoreClick} />
            {stay?.reviews?.length > 6 &&
              <button onClick={() => setModalType('reviews')} className={`open-modal ${isMobile && 'mobile'}`}>Show all {stay?.reviews?.length} reviews</button>
            }
          </div>

        ) : (

          <div ref={refs.reviewRef} className="review-section">
            <StayRating reviews={stay?.reviews} />
            <div className="border"></div>
            {!stay?.reviews?.length && <h2 className="no-reviews">No reviews yet...</h2>}
            <StayReviewList reviews={stay?.reviews} isModal={false} onClick={handleShowMoreClick} />
            {!!stay?.reviews?.length &&
              <button onClick={() => setModalType('reviews')} className={`open-modal ${isMobile && 'mobile'}`}>Show all {stay?.reviews?.length} reviews</button>
            }
          </div>
        )}

        <div className="border"></div>


        <div ref={refs.locationRef} className="map-container">
          <div className="where-map">
            <h3>Where you <span className="upper-comma">,</span>ll be</h3>
            <span className="loc">{stay?.loc.city}, {stay?.loc.country}</span>
          </div>
          <div className="map-wrapper">
            <StayMap location={stay?.loc} />
          </div>
        </div>

        <HostInfo host={stay?.host} stay={stay} />
      </div >

    </section >

    // </div >
  )
}

