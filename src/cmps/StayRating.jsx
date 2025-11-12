import { useRef } from 'react'
import { useIsBreakPoint } from '../customHooks/useIsBreakPoint'
import { getAvgRate } from '../services/util.service'
import { Carousel } from './Carousel'
import { BigRating } from './SmallComponents'
import { amenitiesSvg, reviewSvgs, svgControls } from './Svgs'

export function StayRating({ reviews, isModal = false }) {
    function formatName(str) {
        return str
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
            .replace(/([A-Z])/, (match) => match.toLowerCase()) // Lowercase all the uppercase letters
            .replace(/(^.)/, (match) => match.toUpperCase()) // Capitalize the first letter
    }

    function getAvgRateForCtgs(reviews, svgs) {
        const totalPerCtg = {}
        const countPerCtg = {}
        const overallRatingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

        reviews.forEach(review => {
            const rate = review.rate
            if (!rate) return

            //  For counting per-review avg
            let reviewSum = 0
            let reviewCtgsCount = 0

            for (let category in rate) {
                const rating = rate[category]

                if (!totalPerCtg[category]) {
                    totalPerCtg[category] = 0
                    countPerCtg[category] = 0
                }

                totalPerCtg[category] += rating
                countPerCtg[category] += 1

                reviewSum += rating
                reviewCtgsCount += 1
            }

            //  Compute avg rating per review and round it
            if (reviewCtgsCount > 0) {
                const avg = reviewSum / reviewCtgsCount
                const roundedAvg = Math.round(avg)

                if (overallRatingCounts[roundedAvg] !== undefined) {
                    overallRatingCounts[roundedAvg] += 1
                }
            }
        })

        const avgRateArr = Object.keys(!!totalPerCtg ? svgs : totalPerCtg).map(category => {
            const avg = parseFloat((totalPerCtg[category] / countPerCtg[category]).toFixed(2))
            return {
                category,
                formattedName: formatName(category),
                avg: avg || null,
                svg: svgs?.[category] || null
            }
        })

        return { avgRateArr, overallRatingCounts }
    }

    const { overallRatingCounts } = getAvgRateForCtgs(reviews, reviewSvgs)
    const totalCounts = Object.values(overallRatingCounts).reduce((sum, count) => sum + count, 0)

    const barSegments = [5, 4, 3, 2, 1].map(rating => {
        const count = overallRatingCounts[rating] || 0
        const percent = totalCounts > 0 ? (count / totalCounts) * 100 : 0
        return { rating, percent: percent, count }


    })

    const ratingCategoriesList = (
        <ul className="rating-categories">

            <ul className="overall-rating">
                <span className="h">Overall rating</span>
                {
                    barSegments.map((segment, idx) => (

                        <li className="overall-rating-bar" key={idx}>
                            <span className="num">{segment.rating}</span>

                            <div className="bar-segment" >
                                <div className="bar-fill" style={{ width: `${segment.percent}%` }}></div>
                            </div>

                        </li >
                    )
                    )
                }
            </ul>


            {getAvgRateForCtgs(reviews, reviewSvgs).avgRateArr.map((item, index) => {
                return (

                    <li className="icons-rating" key={index}>
                        <span className="rate-wrapper1">

                            <span className="review-category">
                                {item.formattedName}
                            </span>
                            <h4 className="avg-value">{item.avg}</h4>
                        </span>

                        {item.svg && <span className="svg-rate-icon">{item.svg}</span>}
                    </li>
                )
            }
            )}
        </ul>
    )

    const isMobile = useIsBreakPoint(744)
    const isMiddle = useIsBreakPoint(1127)
    const carouselWrapRef = useRef(null)


    return (

        <div className="rate-wrapper">
            <BigRating reviews={reviews} />

            {isModal && isMiddle ? (
                <div ref={carouselWrapRef} className="rating-carousel-wrapper">

                    <Carousel
                        renderControls={({ scrollState }) => {
                            const getRow = () => carouselWrapRef.current?.querySelector('.carousel-list')
                            const scrollToStart = () => {
                                const row = getRow()
                                if (!row) return
                                row.scrollTo({ left: 0, behavior: 'smooth' })
                            }
                            const scrollToEnd = () => {
                                const row = getRow()
                                if (!row) return
                                row.scrollTo({ left: row.scrollWidth - row.clientWidth, behavior: 'smooth' })
                            }

                            return (
                                <div className="preview-carousel-controls">
                                    <button
                                        disabled={scrollState.atStart}
                                        onClick={scrollToStart}
                                        className={`preview-carousel-btn left ${scrollState.atStart ? 'hide-carousel-btn' : ''}`}
                                    >
                                        <span className='carousel-icon'>{svgControls.chevronLeft}</span>
                                    </button>

                                    <button
                                        disabled={scrollState.atEnd}
                                        onClick={scrollToEnd}
                                        className={`preview-carousel-btn right ${scrollState.atEnd ? 'hide-carousel-btn' : ''}`}
                                    >
                                        <span className='carousel-icon'>{svgControls.chevronRight}</span>
                                    </button>
                                </div>
                            )
                        }}>

                        <>
                            {ratingCategoriesList}
                        </>

                    </Carousel>
                </div>
            ) : (
                <>
                    {ratingCategoriesList}
                </>
            )}

        </div >
    )
}


