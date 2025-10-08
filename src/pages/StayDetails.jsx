import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'

import { amenitiesSvg, reviewSvgs } from '../cmps/Svgs'
import { LongTxt } from '../cmps/LongTxt'
import { calculateNights, getRandomItems } from '../services/util.service'
import { Modal } from '../cmps/Modal'
import { reUseDateRange, useDateRange } from '../customHooks/useDateRange'
import { DateRangePicker } from '../cmps/DateRangePicker'
import { ReDateRangePicker } from '../cmps/ReDateRangePicker'
import { StayRating } from '../cmps/StayRating'
import { StayReviewList } from '../cmps/StayReviewList'
import { AmenitiesLongList, AmenitiesShortList, CalendarStayDates, Capacity, Highlights, MiniHost, SleepingRooms, SmallRating, StayImgs } from '../cmps/SmallComponents'
import { getAmenitiesData } from '../services/stay/stay.service.local'
import { StickyContainer } from '../cmps/StickyContainer'
import { HostInfo } from '../cmps/HostInfo'
import { hostSvgs } from '../cmps/Svgs'
import { useDateContext } from '../context/DateRangeProvider'

const demoStay = {
  _id: "Ytcqd",
  name: "Westin Kaanapali KORVN 2BR",
  type: "Villa",
  imgUrls: [
    "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436975/hx9ravtjop3uqv4giupt.jpg",
    "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436294/mvhb3iazpiar6duvy9we.jpg",
    "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436496/ihozxprafjzuhil9qhh4.jpg",
    "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436952/aef9ajipinpjhkley1e3.jpg",
    "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436948/vgfxpvmcpd2q40qxtuv3.jpg"
  ],
  price: 595,
  cleaningFee: 40,
  summary: `Experience the comfort of the Westin Kaanapali Ocean Resort Villas North in a beautifully maintained timeshare unit on Maui’s stunning Kaanapali Beach. Ideal for couples or solo travelers looking for a peaceful, resort-style getaway.

This unit includes access to premium resort amenities and is ADA/wheelchair accessible (please confirm with the resort directly to ensure your needs are met).

Please note:

A daily resort fee applies:

$14–$20/day for stays 7+ nights

$38/day for stays under 7 nights

Availability is limited and must be approved after inquiry — we’ll review your request and confirm if available.

For guaranteed views, only weekly rentals are eligible and may incur additional charges.

We recommend reading the full “The Space” section for important details about cleaning, timeshare booking, and reservation processes.`,
  rooms: [
    { roomType: 'bedroom', bedType: 'double bed', imgUrl: "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436952/aef9ajipinpjhkley1e3.jpg" },
    { roomType: 'living room', bedType: 'sofa', imgUrl: "http://res.cloudinary.com/dmtlr2viw/image/upload/v1663436975/hx9ravtjop3uqv4giupt.jpg" },
  ],
  guests: 3,
  bathrooms: 2,
  bedrooms: 1,
  beds: 1,
  amenities: [
    "TV", "Cable TV", "Internet", "Wifi", "Air conditioning", "Wheelchair accessible", "Pool", "Kitchen",
    "Free parking on premises", "Doorman", "Gym", "Elevator", "Hot tub", "Heating", "Family/kid friendly",
    "Suitable for events", "Washer", "Dryer", "Smoke detector", "Carbon monoxide detector", "First aid kit",
    "Safety card", "Fire extinguisher", "Essentials", "Shampoo", "24-hour check-in", "Hangers", "Hair dryer",
    "Iron", "Laptop friendly workspace", "Self check-in", "Building staff", "Private entrance",
    "Room-darkening shades", "Hot water", "Bed linens", "Extra pillows and blankets", "Ethernet connection",
    "Luggage drop off allowed", "Long term stays allowed", "Ground floor access", "Wide hallway clearance",
    "Step-free access", "Wide doorway", "Flat path to front door", "Well-lit path to entrance",
    "Disabled parking spot", "Wide clearance to bed", "Wide entryway", "Waterfront", "Beachfront"
  ],
  highlights: [
    { main: 'Dive right in', sub: 'This is one of the few places in the area with a pool.', imgUrl: amenitiesSvg.locaion.pool },
    { main: 'Fully equipped kitchen', sub: 'Guests appreciated the well-stocked kitchen for home-cooked meals.', imgUrl: amenitiesSvg.kitchen.kitchen },
    { main: 'Well-equipped for long stays', sub: 'Guests who stayed a month or longer rated this place 5 stars.', imgUrl: amenitiesSvg.services.longStay }
  ],
  roomType: "Entire home/apt",
  host: {
    _id: "622f3403e36c59e6164faf93",
    firstName: "Patty",
    fullname: "Patty And Beckett",
    location: "Eureka, California, United States",
    about: "We are an adventurous couple who loves to travel :)",
    responseTime: "within an hour",
    pictureUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112365/cld-sample.jpg",
    isSuperhost: true,
    isVerified: true,
    signupDate: 1577836800000,
    rating: 4.92,
    numReviews: 128,
    yearsHosting: 5,
    responseRate: 98,
    responseTime: "within an hour",
    coHosts: [
      {
        name: "Alex",
        imgUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      {
        name: "Jamie",
        imgUrl: "https://randomuser.me/api/portraits/women/46.jpg",
      },
    ],
    personalFacts: [
      { icon: hostSvgs.born, text: "Born in the 80's" },
      { icon: hostSvgs.work, text: "Photographer" },
    ],
  },
  loc: {
    country: "United States",
    countryCode: "US",
    city: "Maui",
    address: "Lahaina, HI, United States",
    lat: -156.6917,
    lan: 20.93792
  },
  reviews: [
    {
      at: "2016-06-12T04:00:00.000Z",
      by: {
        _id: "622f3407e36c59e6164fc004",
        fullname: "Kiesha",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112363/samples/smile.jpg",
        id: "10711825"
      },
      txt: "I had a great experience working with Patty and Peter. Both were very attentive in sorting out the booking details and following up directly when I had questions. I rented a 2 bedroom unit at the Westin Villas in Maui and both the unit and property was absolutely amazing. I think we had the best unit on the resort complete with 2 outdoor patios with direct access to the beach. I would HIGHLY recommend renting with Patty and Peter.",
      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 4.8,
        accuracy: 4.6,
        location: 5,
        value: 4.5,
      },
      nights: 8,
      withKids: false,
      withPet: false,
    },
    {
      at: "2016-07-28T04:00:00.000Z",
      by: {
        _id: "622f3403e36c59e6164fb204",
        fullname: "Chris",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112363/samples/outdoor-woman.jpg",
        id: "70072865"
      },
      txt: "Peter quickly responded to any questions I had before, and during the trip. Will use again, highly recommend.",

      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 4.8,
        accuracy: 4.6,
        location: 5,
        value: 4.5,
      },
      nights: 3,
      withKids: true,
      withPet: false,
    },
    {
      at: "2016-09-11T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb703",
        fullname: "Kim",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112359/samples/two-ladies.jpg",
        id: "71179725"
      },
      txt: "We had the perfect location for a room, first floor right in front of the pool. The resort is beautiful, and the staff is so friendly! I enjoyed it so much, we talked about buying a timeshare ourselves."
      ,
      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 4.8,
        accuracy: 4.6,
        location: 5,
        value: 4.5,
      },
      nights: 3,
      withKids: true,
      withPet: false,
    },
    {
      at: "2017-01-07T05:00:00.000Z",
      by: {
        _id: "622f3404e36c59e6164fb37f",
        fullname: "Tracy",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112355/samples/people/smiling-man.jpg",
        id: "65593239"
      },
      txt: "Beautiful location. Patty & Peter were super helpful and easy to work with!"
      ,
      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 4.8,
        accuracy: 4.6,
        location: 5,
        value: 4.5,
      },
      nights: 9,
      withKids: true,
      withPet: false,
    },
    {
      at: "2017-04-07T04:00:00.000Z",
      by: {
        _id: "622f3403e36c59e6164fb105",
        fullname: "Duyen",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112364/samples/man-portrait.jpg",
        id: "26215688"
      },
      txt: "Great spot for the kids and family and close to beach and everything at the resort. We will definitely be back."
      ,
      rate: {
        cleanliness: 1,
        communication: 1,
        checkIn: 1,
        accuracy: 1,
        location: 1,
        value: 1,
      },
      nights: 3,
      withKids: true,
      withPet: false,
    },
    {
      at: "2017-05-09T04:00:00.000Z",
      by: {
        _id: "622f3402e36c59e6164fabbe",
        fullname: "Binh",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112365/samples/upscale-face-1.jpg",
        id: "117390236"
      },
      txt: "The unit and the Westin offer variety of amenities you can possibly ask for. Sofa beds are very comfortable to sleep in. But there is charge for ocean view upgrade. Overall, I highly recommend to book with Patty and Peter."
      ,
      rate: {
        cleanliness: 4.8,
        communication: 4.9,
        checkIn: 4.8,
        accuracy: 4.6,
        location: 4.8,
        value: 4.5,
      },
      nights: 3,
      withKids: true,
      withPet: false,
    },
    {
      at: "2018-02-24T05:00:00.000Z",
      by: {
        _id: "622f3404e36c59e6164fb4af",
        fullname: "Samy",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112366/main-sample.png",
        id: "15143517"
      },
      txt: "We spent a great week at Patty and Peter's place. The place was exactly as shown in the pictures, very comfortable, nice view, with all amenities. The resort is great with several pools, a long beach, many restaurants, and of course a lot of great activities all around."
      ,
      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 5,
        accuracy: 4.6,
        location: 5,
        value: 5,
      },
      nights: 5,
      withKids: false,
      withPet: false,
    },
    {
      at: "2018-06-16T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb87b",
        fullname: "Breanne",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758116976/bb3osjof90dl0t3kl0nd.png",
        id: "78173091"
      },
      txt: "This place was perfect for my family. We had plenty of room to spread out and the service could not have been any better."
      ,
      rate: {
        cleanliness: 4.8,
        communication: 4.6,
        checkIn: 4.8,
        accuracy: 4.9,
        location: 5,
        value: 4.5,
      },
      nights: 3,
      withKids: false,
      withPet: true,
    },
    {
      at: "2018-06-29T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb713",
        fullname: "Kimberly",
        imgUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112355/samples/people/smiling-man.jpg",
        id: "100535039"
      },
      txt: "We love Westin Kaanapalli",

      rate: {
        cleanliness: 4.8,
        communication: 4.8,
        checkIn: 4.8,
        accuracy: 5,
        location: 5,
        value: 4.8,
      },
      nights: 3,
      withKids: false,
      withPet: false,
    }
  ],
  likedByUsers: []
}


export function StayDetails() {
  const { stayId } = useParams()
  useEffect(() => {
    if (stayId) {
      loadStay(stayId)
    }
  }, [stayId])

  const [searchParams, setSearchParams] = useSearchParams()
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let stay = useSelector(storeState => storeState.stayModule.stay)

  const { dateRange, setDateRange } = useDateContext()
  const [modalType, setModalType] = useState(null)

  const handleDateComplete = (newRange) => {
    if (newRange?.from && newRange?.to) {
      setDateRange(newRange)
    }
  }

  const amenitiesData = getAmenitiesData(amenitiesSvg)


  return (
    <div className="main-container">

      <section className="stay-details">
        {/* <section className="app-header"><AppHeader /></section> */}

        <div className="main-content">
          <h1>{demoStay.name}</h1>

          <StayImgs stay={demoStay} />

          <div className="details-container">
            <div className="content">

              <section className="main-info">

                <div className="first-block">
                  <h2 className="stay-name">{demoStay.roomType} in {demoStay.loc.city},  {demoStay.loc.country}</h2>
                  <Capacity stay={demoStay} />
                  <SmallRating stay={demoStay} onClick={() => setModalType('reviews')} />
                </div>

                <div className="border"></div>

                <MiniHost stay={demoStay} />

                <div className="border"></div>

                <Highlights stay={demoStay} />

                <div className="border"></div>

                <span className="summary">
                  <LongTxt children={demoStay.summary} length={250} />
                  <button className="open-modal" onClick={() => setModalType('summary')}>
                    Show more
                  </button>
                </span>

                <div className="border"></div>

                <SleepingRooms stay={demoStay} />

                <div className="border"></div>

                <div className="amenities">
                  <div className="amenities-container">
                    <h2>What this place offers</h2>
                    <AmenitiesShortList amenitiesData={amenitiesData} />

                    <button onClick={() => setModalType('amenities')} className="open-modal">Show all {amenitiesData.length} amenities</button>
                  </div>
                </div>

                <Modal
                  header=" "
                  isOpen={modalType !== null}
                  onClose={() => setModalType(null)}
                  closePosition='left'
                  className={`${modalType === 'reviews' ? 'reviews-rating-modal' : 'modal-popup'}`}>

                  {modalType === 'reviews' &&
                    <div className="reviews-in-modal">
                      <StayRating reviews={demoStay.reviews} />
                      <StayReviewList reviews={demoStay.reviews} isModal={true} />
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
                        {demoStay.summary
                          .split('\n')
                          .filter(line => line.trim() !== '')
                          .map((line, idx) => (
                            <p key={idx}>{line.trim()}</p>
                          ))}
                      </div>}
                    </>
                  }
                </Modal>

                <div className="border"></div>

                <div className="details-calendar" >
                  <CalendarStayDates stay={demoStay} startDate={startDate} endDate={endDate} />

                  <DateRangePicker
                    value={dateRange}
                    onComplete={handleDateComplete}
                 activeField={"null"}
                 />
                </div>


              </section>
            </div>
            <StickyContainer stay={demoStay} />

          </div>

          <div className="border"></div>
          <div className="review-section">
            <StayRating reviews={demoStay.reviews} />
            <div className="border"></div>
            {!demoStay.reviews?.length && <h2>No reviews yet...</h2>}
            <StayReviewList reviews={demoStay.reviews} isModal={false} />
            <button onClick={() => setModalType('reviews')} className="open-modal">Show all {demoStay.reviews.length} reviews</button>
          </div>

        </div >
        <HostInfo host={demoStay.host} />

      </section >

    </div >
  )
}

