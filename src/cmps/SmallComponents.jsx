import { Link } from "react-router"
import { amenitiesSvg } from "./Svgs"
import { capitalizeFirst } from "../services/util.service"
import { getRandomItems } from "../services/util.service"
import { useRef } from "react"

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
            <h2>Where you'll sleep</h2>
            <div className="bedrooms">
                {stay.rooms.map((room, idx) =>
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
    )
}

export function SmallRating({ stay }) {
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
        <span className="link"><Link to={`stay/${stay._id}/review`}>{stay.reviews.length} {stay.reviews.length === 1 ? 'review' : 'reviews'}</Link></span>
    </div>)
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