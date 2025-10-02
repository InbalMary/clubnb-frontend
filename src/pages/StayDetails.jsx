import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DateRangePicker } from "../cmps/DateRangePicker"

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'

import { amenitiesSvg, reviewSvgs } from '../cmps/Svgs'
import { LongTxt } from '../cmps/LongTxt'
import { getRandomItems } from '../services/util.service'
import { Modal } from '../cmps/Modal'
import { useDateRange } from '../customHooks/useDateRange'
import { DayPicker } from 'react-day-picker'
import { ReDateRangePicker } from '../cmps/ReDateRangePicker'
// import { useDateRange } from '../customHooks/useDateRange'
// import { DateSelector } from '../cmps/DateSelector'

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
    fullname: "Patty And Beckett",
    location: "Eureka, California, United States",
    about: "Adventurous couple loves to travel :)",
    responseTime: "within an hour",
    pictureUrl: "https://res.cloudinary.com/dwwzbzmpy/image/upload/v1758112365/cld-sample.jpg",
    isSuperhost: true,
    signupDate: 1577836800000,
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
        imgUrl: "https://robohash.org/10711825?set=set1",
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
    },
    {
      at: "2016-07-28T04:00:00.000Z",
      by: {
        _id: "622f3403e36c59e6164fb204",
        fullname: "Chris",
        imgUrl: "https://robohash.org/70072865?set=set1",
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
      }
    },
    {
      at: "2016-09-11T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb703",
        fullname: "Kim",
        imgUrl: "https://robohash.org/71179725?set=set1",
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
      }
    },
    {
      at: "2017-01-07T05:00:00.000Z",
      by: {
        _id: "622f3404e36c59e6164fb37f",
        fullname: "Tracy",
        imgUrl: "https://robohash.org/65593239?set=set1",
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
      }
    },
    {
      at: "2017-04-07T04:00:00.000Z",
      by: {
        _id: "622f3403e36c59e6164fb105",
        fullname: "Duyen",
        imgUrl: "https://robohash.org/26215688?set=set1",
        id: "26215688"
      },
      txt: "Great spot for the kids and family and close to beach and everything at the resort. We will definitely be back."
      ,
      rate: {
        cleanliness: 4.4,
        communication: 4.9,
        checkIn: 4.4,
        accuracy: 4.6,
        location: 5,
        value: 5,
      }
    },
    {
      at: "2017-05-09T04:00:00.000Z",
      by: {
        _id: "622f3402e36c59e6164fabbe",
        fullname: "Binh",
        imgUrl: "https://robohash.org/117390236?set=set1",
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
      }
    },
    {
      at: "2018-02-24T05:00:00.000Z",
      by: {
        _id: "622f3404e36c59e6164fb4af",
        fullname: "Samy",
        imgUrl: "https://robohash.org/15143517?set=set1",
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
      }
    },
    {
      at: "2018-06-16T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb87b",
        fullname: "Breanne",
        imgUrl: "https://robohash.org/78173091?set=set1",
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
      }
    },
    {
      at: "2018-06-29T04:00:00.000Z",
      by: {
        _id: "622f3405e36c59e6164fb713",
        fullname: "Kimberly",
        imgUrl: "https://robohash.org/100535039?set=set1",
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
      }
    }
  ],
  likedByUsers: []
}


export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  const { dateRange, setDateRange } = useDateRange()
  const [modalType, setModalType] = useState(null)

  const modifiers = {
    checkin: dateRange.from,
    checkout: dateRange.to,
    range: dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined
  }
  useEffect(() => {
  }, [modifiers]
  )


  const handleDateComplete = (range) => {
    setDateRange(range)
  }

  function formatName(str) {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
      .replace(/([A-Z])/, (match) => match.toLowerCase()) // Lowercase all the uppercase letters
      .replace(/(^.)/, (match) => match.toUpperCase()) // Capitalize the first letter
  }

  function getAvgRate(reviews) {
    let totalSum = 0
    let totalReviews = 0

    reviews.forEach((review) => {
      const rates = Object.values(review.rate).reduce((sum, currentValue) => sum + currentValue, 0)

      const avgRateForReview = rates / Object.values(review.rate).length

      totalSum += avgRateForReview
      totalReviews += 1
    })
    const avgRate = totalSum / totalReviews
    const roundedAverage = avgRate.toFixed(2)
    return roundedAverage
  }

  function getAvgRateForCtgs(reviews, svgs) {
    const totalPerCtg = {}
    const countPerCtg = {}
    const overallRatingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    let total = 0
    let numCtgs = 0

    reviews.forEach(review => {
      const rate = review.rate
      if (!rate) return

      for (let category in rate) {
        const rating = rate[category]

        if (!totalPerCtg[category]) {
          totalPerCtg[category] = 0
          countPerCtg[category] = 0
        }

        totalPerCtg[category] += rating
        countPerCtg[category] += 1

        total += rating
        numCtgs += 1
      }
    })

    if (numCtgs > 0) {
      const avg = total / numCtgs
      const roundedAvg = Math.round(avg)
      if (overallRatingCounts[roundedAvg] !== undefined) {
        overallRatingCounts[roundedAvg] += 1
      }
    }

    const avgRateArr = Object.keys(totalPerCtg).map(category => {
      const avg = parseFloat((totalPerCtg[category] / countPerCtg[category]).toFixed(2))
      return {
        category,
        formattedName: formatName(category),
        avg,
        svg: svgs?.[category] || null
      }
    })

    return { avgRateArr, overallRatingCounts }
  }

  function getHostingTime(host) {
    const currentDate = new Date(Date.now())
    const signupDate = new Date(host.signupDate)
    const yearsDifference = currentDate.getFullYear() - signupDate.getFullYear()
    const monthsDifference = currentDate.getMonth() - signupDate.getMonth()

    if (yearsDifference >= 1) {
      return `${yearsDifference} years`
    } else {
      return `${monthsDifference} months`
    }
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function getAmenitiesData(amenitiesSvgs) {

    const categories = ['bathroom', 'bedroom', 'bookingOptions', 'essentials', 'family', 'features', 'kitchen', 'locaion',
      'outdoor', 'parking', 'safety', 'services', 'notIncluded']

    const amenitiesArr = []

    categories.forEach(category => {
      // If category exists in amenitiesSvgs
      if (amenitiesSvgs[category]) {

        Object.keys(amenitiesSvgs[category]).forEach(item => {
          const formattedItem = formatName(item)
          amenitiesArr.push({
            type: category,
            name: formattedItem,
            svgUrl: amenitiesSvgs[category][item]
          })

        })
      }
    })
    return amenitiesArr
  }
  const amenitiesData = getAmenitiesData(amenitiesSvg)
  // console.log('amenitiesData:', amenitiesData)

  const groupedAmenities = amenitiesData.reduce((acc, amenity) => {
    const { type } = amenity
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(amenity)
    return acc
  }, {})

  // console.log('groupedAmenities:', groupedAmenities)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  return (
    <div className="main-container">

      <section className="stay-details">
        {/* <section className="app-header"><AppHeader /></section> */}

        <div className="main-content">
          <h1>{demoStay.name}</h1>
          <section className="details-imgs">
            {demoStay.imgUrls.map((url, idx) =>
              <div key={url} className={`img-container img-${idx + 1}`}><img src={url} /></div>
            )}
          </section>
          <div className="details-container">
            <div className="content">

              <section className="main-info">

                <div className="first-block">

                  <h2 className="stay-name">{demoStay.roomType} in {demoStay.loc.city},  {demoStay.loc.country}</h2>
                  <div className="capacity">

                    <span className="">{demoStay.guests} {demoStay.guests === 1 ? "guest" : "guests"}</span>
                    <span className="dot " />
                    <span className="">{demoStay.bedrooms} {demoStay.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
                    <span className="dot " />
                    <span className="">{demoStay.beds} {demoStay.beds === 1 ? "bed" : "beds"}</span>
                    <span className="dot " />
                    <span className="">{demoStay.bathrooms} {demoStay.bathrooms === 1 ? "bathroom" : "bathrooms"}</span>
                  </div>
                  <div className="rating">
                    <span className="rate">{amenitiesSvg.rate}</span>
                    <span className="avg">{getAvgRate(demoStay.reviews)}</span>
                    <span className="dot" />
                    <span className="link"><Link to={`stay/${demoStay._id}/review`}>{demoStay.reviews.length} {demoStay.reviews.length === 1 ? 'review' : 'reviews'}</Link></span>
                  </div>
                </div>

                <div className="border"></div>

                <div className="mini-host flex">
                  <img className="host-img" src={demoStay.host.pictureUrl} />
                  <span>
                    <h3>Hosted by {demoStay.host.fullname}</h3>
                    <span className="light"> {demoStay.host.isSuperhost ? "Superhost" : ''} <span className="dot light" /> </span>
                    <span className="light">{getHostingTime(demoStay.host)} hosting</span>
                  </span>
                </div>
                <div className="border"></div>


                <div className="highlights">
                  <ul>
                    {demoStay.highlights.map(hightLight =>
                      <li key={hightLight.main}>
                        <span className="highlight-icon">{hightLight.imgUrl}</span>
                        <div>
                          <h3>{hightLight.main}</h3>
                          <span className="light"> {hightLight.sub}</span>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="border"></div>

                <span className="summary">
                  <LongTxt children={demoStay.summary} length={250} />
                  <button className="open-modal" onClick={() => setModalType('summary')}>
                    Show more
                  </button>
                </span>

                <div className="border"></div>

                <div className="beds-container">
                  <h2>Where you'll sleep</h2>
                  <div className="bedrooms">
                    {demoStay.rooms.map((room, idx) =>
                      <div key={room + idx} className="bedroom">
                        <div className="img">
                          <img key={room.imgUrl} src={room.imgUrl || amenitiesSvg.bedroom.doubleBed} />
                        </div>
                        <div key={room.roomType} className="bold">{capitalizeFirst(room.roomType)}</div>
                        <span className="light" key={room.bedType}>1 {room.bedType}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border"></div>

                <div className="amenities">
                  <div className="amenities-container">
                    <h2>What this place offers</h2>

                    <ul className="amenities-short-list">
                      {
                        getRandomItems(amenitiesData).map(amenity => {
                          return (
                            <li className="amenity flex" key={amenity.name}>
                              <span key={amenity.name + 1}>
                                {amenity.svgUrl}
                              </span>
                              <span>{amenity.name}</span>
                            </li>
                          )
                        })}
                    </ul>

                    <button onClick={() => setModalType('amenities')} className="open-modal">Show all {amenitiesData.length} amenities</button>


                    <Modal
                      isOpen={modalType !== null}
                      onClose={() => setModalType(null)}
                      header={<button onClick={() => setModalType(null)} className="close-modal">{amenitiesSvg.x}</button>}>

                      {modalType === 'amenities' && (

                        <>
                          <h2>What this place offers</h2>

                          <ul className="types-list">
                            {
                              Object.entries(groupedAmenities).map(([type, amenities]) => (
                                <li className="type" key={type}>

                                  <h3>{capitalizeFirst(type)}</h3>
                                  <ul className="amenities-list">
                                    {amenities.map(amenity => {
                                      return (
                                        <>
                                          <li className="amenity flex" key={amenity.name}>
                                            <span key={amenity.name + 1}>
                                              {amenity.svgUrl}
                                            </span>
                                            <span>{amenity.name}</span>
                                          </li>
                                          <div className="border"></div>
                                        </>
                                      )
                                    })}
                                  </ul>
                                </li>
                              ))

                            }
                          </ul>
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

                  </div>
                </div>
                <div className="border"></div>

                <div className="details-calendar" >

                  <ReDateRangePicker
                    value={dateRange}
                    onComplete={handleDateComplete}
                  />
                </div>
                <div className="border"></div>
                <div className="rating-container">

                  <div className="rating big">
                    <span className="rate bold">{amenitiesSvg.bigRate}</span>
                    <span className="avg bold">{getAvgRate(demoStay.reviews)} </span>
                    <span className="dot bold" />
                    <span className="bold"> {demoStay.reviews.length} {demoStay.reviews.length === 1 ? 'review' : 'reviews'}</span>
                  </div>

                  <section className="rating-categories">

                    <ul>
                      {
                        getAvgRateForCtgs(demoStay.reviews, reviewSvgs).avgRateArr.map((item, index) => {
                          return (

                            <li key={index}>
                              {item.svg && <span className="svg-icon">{item.svg}</span>}

                              <span className="review-category">
                                {item.formattedName}
                              </span>
                              <span className="avg-value">{item.avg}</span>

                            </li>
                          )
                        }
                        )}
                    </ul>

                  </section>

                </div>
              </section>
            </div>
          </div>
        </div >


      </section >
    </div >
  )
}
