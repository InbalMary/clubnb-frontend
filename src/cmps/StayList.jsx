import { useRef } from 'react'
import { StayPreview } from './stayPreview'
import { Carousel } from './Carousel'

import rightPointer from '../assets/svgs/right-pointer.svg'
import arrowRight from '../assets/svgs/right-carousel.svg'
import arrowLeft from '../assets/svgs/left-carousel.svg'

export function StayList({ stays }) {
    const firstCardRef = useRef(null)
    const categories = [...new Set(stays.map(stay => stay.type))]

    return (
        <section className='stay-list-section'>
            {categories.map(type => {
                const rowStays = stays.filter(stay => stay.type === type)
                if (!rowStays.length) return null

                return (
                    <div className='stay-row' key={type}>
                        {/* We pass a function (renderControls) down to Carousel.
                            Carousel will call this function, giving us its scroll state + scroll logic.
                            Whatever JSX we return here gets rendered inside Carousel. */}
                        <Carousel
                            firstCardRef={firstCardRef}
                            renderControls={({ scrollState, scrollRow }) => (
                                <div className='stay-row-header'>
                                    <h3 className="stay-list-title">{type}
                                        <img src={rightPointer} className='right-pointer' />
                                    </h3>

                                    <div className="carousel-controls">
                                        <button disabled={scrollState.atStart} onClick={() => scrollRow(-1)}>
                                            <img src={arrowLeft} alt="Scroll left" className='carousel-icon' />
                                        </button>
                                        <button disabled={scrollState.atEnd} onClick={() => scrollRow(1)}>
                                            <img src={arrowRight} alt="Scroll right" className='carousel-icon' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        >
                            {rowStays.map((stay, idx) => (
                                <li key={stay._id} ref={idx === 0 ? firstCardRef : null}>
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

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px"}}>

</svg> */}
