import { amenitiesSvg, reviewSvgs } from './Svgs'

export function StayRating({ reviews }) {
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

    const { overallRatingCounts } = getAvgRateForCtgs(reviews, reviewSvgs)
    const totalCounts = Object.values(overallRatingCounts).reduce((sum, count) => sum + count, 0)

    const barSegments = [5, 4, 3, 2, 1].map(rating => {
        const count = overallRatingCounts[rating] || 0
        const percent = totalCounts > 0 ? (count / totalCounts) * 100 : 0
        return { rating, percent: percent, count }


    })
    return (

        <div className="rate-wrapper">

            <div className="rating big">
                <span className="rate bold">{amenitiesSvg.bigRate}</span>
                <span className="avg bold">{getAvgRate(reviews)} </span>
                <span className="dot bold" />
                <span className="bold"> {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </div>

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
                                <span className="avg-value">{item.avg}</span>
                            </span>

                            {item.svg && <span className="svg-icon">{item.svg}</span>}
                        </li>
                    )
                }
                )}
            </ul>


        </div>
    )
}


