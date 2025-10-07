import { useState } from "react"
import { getRandomIntInclusive } from "../services/util.service"
import { LongTxt } from "./LongTxt"
import { amenitiesSvg } from "./Svgs"
import { StayRating } from "./StayRating"
import { Modal } from "./Modal"
import { Link } from "react-router"

export function StayReviewList({ reviews, isModal }) {

    function getStayTypeFromReview(review) {
        if (review.withKids) return "Stayed with kids"
        if (review.withPet) return "Stayed with a pet"
        if (review.nights >= 7) return "Stayed over a week"
        return "Stayed a few nights"
    }

    return (
        <section className="reviews-section">
            <ul className="review-list">
                {reviews.slice(0, 6).map(review =>
                    <li className="stay-review" key={review.by.fullname}>
                        <div className="mini-user flex">
                            <img className="user-img" src={review.by.imgUrl} />
                            <span>
                                <h3>{review.by.fullname}</h3>
                                <span className="years">{getRandomIntInclusive(1, 7)} years on Clubnb</span>
                            </span>
                        </div>
                        <div className="pre">
                            <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>{amenitiesSvg.rate}</span>
                                ))}
                            </div>
                            <span className="dot" />
                            <h3>{new Date(review.at).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
                            <span className="dot" />
                            <span className="light"> {getStayTypeFromReview(review)}</span>
                        </div>
                        <span className="txt"><LongTxt children={review.txt} length={isModal ? 1000 : 120} /></span>
                        {!isModal && <span className="link bold">Show more</span>}
                    </li>

                )}
            </ul>

        </section>
    )
}