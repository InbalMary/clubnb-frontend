import { Link } from "react-router"
import { amenitiesSvg } from "./Svgs"
import { calculateNights, capitalizeFirst, debounce } from "../services/util.service"
import { getRandomItems } from "../services/util.service"
import { useEffect, useRef, useState } from "react"
import diamond from "../assets/svgs/diamond.png"


export function Highlights({ stay }) {
    return (<div className="highlights">
        <ul>
            {stay.highlights.map(hightLight =>
                <li key={hightLight.main}>
                    <span className="highlight-icon">{hightLight.imgUrl}</span>
                    <div>
                        <h3>{hightLight.main}</h3>
                        <span className="light"> {hightLight.sub}</span>
                    </div>
                </li>
            )}
        </ul>
    </div>)
}

export function Capacity({ stay }) {
    return (<div className="capacity">
        <span className="">{stay.guests} {stay.guests === 1 ? "guest" : "guests"}</span>
        <span className="dot " />
        <span className="">{stay.bedrooms} {stay.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
        <span className="dot " />
        <span className="">{stay.beds} {stay.beds === 1 ? "bed" : "beds"}</span>
        <span className="dot " />
        <span className="">{stay.bathrooms} {stay.bathrooms === 1 ? "bathroom" : "bathrooms"}</span>
    </div>)
}

export function StayImgs({ stay }) {
    return (
        <section className="details-imgs">
            {stay.imgUrls.map((url, idx) =>
                <div key={url} className={`img-container img-${idx + 1}`}><img src={url} /></div>
            )}
        </section>
    )
}

export function AmenitiesShortList({ amenitiesData }) {

    const randomAmenitiesRef = useRef(null)

    if (!randomAmenitiesRef.current) {
        randomAmenitiesRef.current = getRandomItems(amenitiesData, 10)
    }
    const randomAmenities = randomAmenitiesRef.current

    return (
        <ul className="amenities-short-list">
            {
                randomAmenities.map(amenity => {
                    return (
                        <li className="amenity-short flex" key={amenity.name}>
                            <span key={amenity.name + 1}>
                                {amenity.svgUrl}
                            </span>
                            <span>{amenity.name}</span>
                        </li>
                    )
                })}
        </ul>
    )
}

export function AmenitiesLongList({ amenitiesData }) {

    const groupedAmenities = amenitiesData.reduce((acc, amenity) => {
        const { type } = amenity
        if (!acc[type]) {
            acc[type] = []
        }
        acc[type].push(amenity)
        return acc
    }, {})

    return (
        <ul className="types-list">
            {
                Object.entries(groupedAmenities).map(([type, amenities]) => (
                    <li className="type" key={type}>

                        <h3>{capitalizeFirst(type)}</h3>
                        <ul className="amenities-list">
                            {amenities.map(amenity => {
                                return (
                                    <>
                                        <li className="amenity flex" key={amenity}>
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
    )
}

export function SleepingRooms({ stay }) {
    return (
        <div className="beds-container">

            <h2>Where you <span className="upper-comma">,</span>ll sleep</h2>
            <div className="bedrooms">
                {stay.rooms.map((room, idx) =>
                    <div key={room + idx} className="bedroom">
                        <div className="img">
                            <img key={room.imgUrl} src={room.imgUrl || amenitiesSvg.bedroom.doubleBed} />
                        </div>
                        <h4 key={room.roomType} className="bedroom-h bold">{capitalizeFirst(room.roomType)}</h4>
                        <span className="light" key={room.bedType}>1 {room.bedType}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export function CalendarStayDates({ stay, startDate, endDate }) {
    const numNights = calculateNights(startDate, endDate)

    return (
        <div className="calendar-date">

            {typeof numNights === 'number' && numNights > 0 ? (
                <>
                    <h2>
                        {numNights} {numNights === 1 ? 'night' : 'nights'} {stay && `in ${stay?.loc?.city}`}
                    </h2>
                    <h2></h2>
                </>
            ) : startDate ? (
                <h2>Select check-out date</h2>
            ) : (
                <h2>Select check-in date</h2>
            )
            }
            {
                (numNights > 0) ?
                    (<>
                        <span className="light">{new Date(startDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - </span>
                        <span className="light">{new Date(endDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </>)
                    : <span className="light">Add your travel dates for exact pricing</span>
            }
        </div>


    )
}

export function SmallRating({ stay, onClick, readOnly = false }) {
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

    return (<div className="rating">
        <span className="rate">{amenitiesSvg.rate}</span>
        <span className="avg">{getAvgRate(stay.reviews)}</span>
        <span className="dot" />

        {readOnly ? (
            <span className={"light"}>{stay.reviews.length} {stay.reviews.length === 1 ? 'review' : 'reviews'}</span>
        ) : (
            <span onClick={onClick} className={"link"}>{stay.reviews.length} {stay.reviews.length === 1 ? 'review' : 'reviews'}</span>
        )
        }

    </div >)
}

export function MiniHost({ stay }) {

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

    return (<div className="mini-host flex">
        <img className="host-img" src={stay.host.pictureUrl} />
        <span>
            <h3>Hosted by {stay.host.fullname}</h3>
            <span className="light"> {stay.host.isSuperhost ? "Superhost" : ''} <span className="dot light" /> </span>
            <span className="light">{getHostingTime(stay.host)} hosting</span>
        </span>
    </div>)
}

export function FancyButton({ children, onClick, className = '' }) {
    const buttonRef = useRef()

    const handleMouseMove = (e) => {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        buttonRef.current.style.setProperty('--mouse-x', `${x}%`)
        buttonRef.current.style.setProperty('--mouse-y', `${y}%`)
    }

    return (
        <button
            className={`pink ${className}`}
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onClick={onClick}
        >
            {children}
        </button>
    )

}

export function HomeMarkerIcon({ size = 48, fill = '#fefefe' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 256 256"
        >
            <g
                fill={fill}
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{ mixBlendMode: "normal" }}
            >

                <g transform="scale(5.33333,5.33333)">
                    <path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z" />
                </g>
            </g>
        </svg>
    )
}

export function MiniStickyContainer({ stay, startDate, endDate, onClick }) {

    return (
        <div className="mini-sticky-container">
            <div className="mini-rating-wrapper">
                <RareFind show={false} stay={stay} startDate={startDate} endDate={endDate} />
                <SmallRating readOnly={true} stay={stay} />
            </div>
            <div className="button-wrapper">
                <FancyButton onClick={onclick}>
                    <div>
                        {(startDate && endDate) ? 'Reserve' : 'Check availability'}
                    </div>
                </FancyButton>
            </div>
        </div>
    )
}

export function RareFind({ show = true, stay, startDate, endDate }) {
    const [showRareFind, setShowRareFind] = useState(false);

    const debouncedShowRef = useRef(
        debounce(() => {
            setShowRareFind(true)
        }, 200)
    )

    useEffect(() => {
        if (startDate && endDate) {
            debouncedShowRef.current()
        } else {
            setShowRareFind(false)
            debouncedShowRef.current.cancel()
        }
        return () => {
            setShowRareFind(false)
            debouncedShowRef.current.cancel()
        }
    }, [show, startDate, endDate])

    if (!show) return null
    return (
        <div>
            {showRareFind ? (
                <>
                    {show &&
                        <h3 className="rare-find_sticky">{<img src={diamond} style={{ width: '30px' }} />} Rare find! This place is usually booked</h3>
                    }
                    <span className="cash-per-night">
                        <h2 className="cash_sticky">{`$ ${stay.price}`}</h2><span>night</span>
                    </span>
                </>

            ) : (

                <h2 className="add-dates_sticky">Add dates for prices</h2>
            )}
        </div>
    )
}