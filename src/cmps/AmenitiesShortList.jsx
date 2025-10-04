import { getRandomItems } from "../services/util.service"
import { useRef } from "react"

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