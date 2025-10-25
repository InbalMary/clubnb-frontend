import { createRef, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay } from '../store/actions/stay.actions'

import { amenitiesSvg, svgControls } from '../cmps/Svgs'
import { LongTxt } from '../cmps/LongTxt'
import { Modal } from '../cmps/Modal'
import { DateRangePicker } from '../cmps/DateRangePicker'
import { StayRating } from '../cmps/StayRating'
import { StayReviewList } from '../cmps/StayReviewList'
import { AmenitiesLongList, AmenitiesShortList, CalendarStayDates, Capacity, DetailsSkeleton, Highlights, MiniHost, SleepingRooms, SmallRating, StayImgs } from '../cmps/SmallComponents'
import { getAmenitiesData } from '../services/stay/stay.service.local'
import { StickyContainer } from '../cmps/StickyContainer'
import { HostInfo } from '../cmps/HostInfo'
import { StayMap } from '../cmps/StayMap'
import { StayHeader } from '../cmps/StayHeader'
import { useDateRange } from '../customHooks/useDateRange'
import { removeStayFromWishlist, removeWishlist } from '../store/actions/wishlist.actions'
import { WishlistModal } from '../cmps/WishListModal'


export function StayDetails() {
  const { stayId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let stay = useSelector(storeState => storeState.stayModule.stay)
  const isLoading = useSelector(storeState => storeState.stayModule.isLoading)

  useEffect(() => {
    if (stayId)
      loadStay(stayId)

  }, [stayId])

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isLoading])

  const { dateRange, setDateRange } = useDateRange()

  const [modalType, setModalType] = useState(null)
  const [selectedReviewIdx, setSelectedReviewIdx] = useState(null)

  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
  const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)

  const isAddedToWishlist = stay?._id && Array.isArray(wishlists)
    ? wishlists.some(wl =>
      Array.isArray(wl.stays) &&
      wl.stays.some(stayInList => stayInList?._id === stay._id)
    )
    : false

  async function onToggleWishlist(ev) {
    ev.stopPropagation()
    try {
      if (isAddedToWishlist) {
        const wishlistWithStay = wishlists.find(wishlist =>
          wishlist.stays.some(stayInList => stayInList._id === stay._id)
        )
        if (wishlistWithStay) {
          if (wishlistWithStay.stays.length === 1) {
            await removeWishlist(wishlistWithStay._id)
            showSuccessMsg(`Wishlist ${wishlistWithStay.title} deleted`, stay.imgUrls?.[0])
          } else {
            await removeStayFromWishlist(wishlistWithStay, stay._id)
            showSuccessMsg(`Removed from wishlist ${wishlistWithStay.title}`, stay.imgUrls?.[0])
          }
        }
      } else {
        setIsWishlistModalOpen(true)
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err)
      showErrorMsg('Could not update wishlist, please try again.')
    }
  }

  const refs = {
    photoRef: useRef(null),
    amenitiesRef: useRef(null),
    reviewRef: useRef(null),
    locationRef: useRef(null),
    stickyContainerRef: useRef(null)
  }

  const handleDateComplete = (newRange) => {
    if (newRange?.from && newRange?.to) {
      setDateRange(newRange)
    }
  }

  const reviewRefs = useMemo(() => stay?.reviews?.map(() => createRef()), [stay?.reviews])

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

  const amenitiesData = getAmenitiesData(amenitiesSvg, stay?.amenities)

  function getGuestsFromParams(params) {
    return {
      adults: Number(params.get('adults')),
      children: Number(params.get('children')),
      infants: Number(params.get('infants')),
      pets: Number(params.get('pets')),
    }
  }

  const guests = getGuestsFromParams(searchParams)

  if (!stay) return <div className="loading-overlay"><DetailsSkeleton />  </div>

  return (
    <div className="main-page">
      <section className="stay-details">

        {(!stay || isLoading) && (
          <div className="loading-overlay">
            <DetailsSkeleton />
          </div>
        )}

        <div className="main-content">
          <div className="share-wishlist flex justify-between">
            <h1 ref={refs.photoRef}>{stay?.name}</h1>
            <div className="share-btns-container flex">
              <button className="share-btn">
                <span className="share-icon">{svgControls.share}<span className="link">Share</span></span>
              </button>

              <button className="save-heart-btn" onClick={onToggleWishlist}>
                <span className={`heart-icon ${isAddedToWishlist ? 'active' : ''}`}>{svgControls.heart}
                  <span className="link">{isAddedToWishlist ? 'Saved' : 'Save'}</span>
                </span>
              </button>
              <WishlistModal
                stay={stay}
                isOpen={isWishlistModalOpen}
                isAddedToWishlist={isAddedToWishlist}
                onClose={() => setIsWishlistModalOpen(false)}
              />
            </div>
          </div>

          <StayImgs stay={stay} />

          <StayHeader refs={refs} stay={stay} guests={guests} startDate={startDate} endDate={endDate} />
          <div className="details-container">
            <div className="content">

              <section className="main-info">

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
                      <button className="open-modal" onClick={() => setModalType('summary')}>
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

                      <button onClick={() => setModalType('amenities')} className="open-modal">Show all {amenitiesData.length} amenities</button>
                    </div>
                  }
                </div>

                <Modal
                  header=" "
                  isOpen={modalType !== null}
                  onClose={() => setModalType(null)}
                  closePosition='left'
                  className={`${modalType === 'reviews' ? 'reviews-rating-modal' : 'modal-popup'}`}>

                  {modalType === 'reviews' &&
                    <div className="reviews-in-modal">
                      <StayRating reviews={stay.reviews} />
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

                <div className="details-calendar" >
                  <CalendarStayDates stay={stay} startDate={startDate} endDate={endDate} />

                  <DateRangePicker
                    value={dateRange}
                    onComplete={handleDateComplete}
                    activeField={"null"}
                  />
                </div>

              </section>
            </div>
            <div ref={refs.stickyContainerRef} className="sticky-ref">

              <StickyContainer stay={stay}
                dateRange={dateRange}
                setDateRange={setDateRange} />
            </div>


          </div>

          <div className="border"></div>

          <div ref={refs.reviewRef} className="review-section">
            <StayRating reviews={stay?.reviews} />
            <div className="border"></div>
            {!stay?.reviews?.length && <h2 className="no-reviews">No reviews yet...</h2>}
            <StayReviewList reviews={stay?.reviews} isModal={false} onClick={handleShowMoreClick} />
            {!!stay?.reviews?.length &&
              <button onClick={() => setModalType('reviews')} className="open-modal">Show all {stay?.reviews?.length} reviews</button>
            }
            <div className="border"></div>
          </div>


          <div ref={refs.locationRef} className="map-container">
            <div className="where-map">
              <h3>Where you <span className="upper-comma">,</span>ll be</h3>
              <span className="loc">{stay?.loc.city}, {stay?.loc.country}</span>
            </div>
            <div className="map-wrapper">
              <StayMap location={stay?.loc} />
            </div>
          </div>

          <HostInfo host={stay?.host} />
        </div >

      </section >

    </div >
  )
}

