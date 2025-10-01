import { StayPreview } from './stayPreview'
import { Carousel } from './Carousel'

import rightPointer from '../assets/svgs/right-pointer.svg'
import arrowRight from '../assets/svgs/right-carousel.svg'
import arrowLeft from '../assets/svgs/left-carousel.svg'

export function StayList({ stays }) {

    const demoTitles = ['Featured Stays', 'Top Rated', 'Beachfront', 'City Escapes', 'Nature Retreats']

    return (
        <section className='stay-list-section'>
            {demoTitles.map((title, idx) => { //how many rows and which header each row gets
                const rowStays = stays.slice(idx * 7, idx * 7 + 7)
                if (!rowStays.length) return null


                return (
                    <div className='stay-row' key={title}>
                        {/* We pass a function (renderControls) down to Carousel.
                            Carousel will call this function, giving us its scroll state + scroll logic.
                            Whatever JSX we return here gets rendered inside Carousel. */}
                        <Carousel
                            renderControls={({ scrollState, scrollRow }) => (
                                <div className='stay-row-header'>
                                    <h3 className="stay-list-title">{title}
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
                            {rowStays.map(stay => (
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

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px"}}>

</svg> */}
