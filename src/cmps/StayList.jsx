import { StayPreview } from './StayPreview'
import { Carousel } from './Carousel'
import { svgControls } from './Svgs'

export function StayList({ stays }) {
    const categories = [...new Set(stays.map(stay => stay.type))]

    return (
        <section className='stay-list-section main-container'>
            {categories.map(type => {
                const rowStays = stays.filter(stay => stay.type === type)
                if (!rowStays.length) return null

                return (
                    <div className='stay-row' key={type}>
                        {/* We pass a function (renderControls) down to Carousel.
                            Carousel will call this function, giving us its scroll state + scroll logic.
                            Whatever JSX we return here gets rendered inside Carousel. */}
                        <Carousel
                            renderControls={({ scrollState, scrollRow }) => (
                                <div className='stay-row-header'>
                                    <h3 className="stay-list-title">{type}
                                        <span className='right-pointer'>{svgControls.chevronRight}</span>
                                    </h3>

                                    <div className="carousel-controls">
                                        <button disabled={scrollState.atStart} onClick={() => scrollRow(-1)}>
                                            <span className='carousel-icon'>{svgControls.chevronLeft}</span>
                                        </button>
                                        <button disabled={scrollState.atEnd} onClick={() => scrollRow(1)}>
                                            <span className='carousel-icon'>{svgControls.chevronRight}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        >
                            {rowStays.map((stay) => (
                                <li key={stay._id}>
                                    <StayPreview stay={stay} />
                                </li>
                            ))}
                        </Carousel>
                    </div>
                )
            })}
        </section >
    )
}


