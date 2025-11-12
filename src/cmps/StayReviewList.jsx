import { useIsBreakPoint } from "../customHooks/useIsBreakPoint"
import { getRandomIntInclusive } from "../services/util.service"
import { LongTxt } from "./LongTxt"
import { amenitiesSvg } from "./Svgs"
import { Carousel } from '../cmps/Carousel'


export function StayReviewList({ reviewRefs, reviews, isModal, onClick }) {

    const isMobile = useIsBreakPoint(744)
    return (
        <section className={`reviews-section ${isMobile ? 'mobile' : ''}`}>
            {!isModal && isMobile ? (

                <Carousel>
                    <div className={`review-list ${!isModal && isMobile ? 'mobile' : ''}`}>
                        {(!isModal ? reviews.slice(0, 6) : reviews).map((review, idx) =>
                            <li
                                ref={isModal ? reviewRefs[idx] : null}
                                className="stay-review"
                                key={idx}
                            >
                                <StayReviewPreview review={review} isModal={isModal} />
                                {!isModal && (
                                    <span onClick={() => onClick(idx)} className="link bold">
                                        Show more
                                    </span>
                                )}
                            </li>
                        )}
                    </div>
                </Carousel>
            ) : (
                <ul className={`review-list ${isMobile ? 'mobile' : ''}`}>
                    {(!isModal ? reviews.slice(0, 6) : reviews).map((review, idx) =>
                        <li ref={isModal ? reviewRefs[idx] : null} className="stay-review" key={idx}>
                            <StayReviewPreview review={review} isModal={isModal} />
                            {!isModal && <span onClick={() => onClick(idx)} className="link bold">Show more</span>}
                        </li>
                    )}
                </ul>
            )}

        </section >
    )
}

function StayReviewPreview({ review, isModal }) {
    function getStayTypeFromReview(review) {
        if (review.withKids) return "Stayed with kids"
        if (review.withPet) return "Stayed with a pet"
        if (review.nights >= 7) return "Stayed over a week"
        return "Stayed a few nights"
    }

    return (
        <>
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
        </>
    )
}