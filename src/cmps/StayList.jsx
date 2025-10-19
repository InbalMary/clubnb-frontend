import { StayPreview } from './StayPreview'
import { Carousel } from './Carousel'
import { svgControls } from './Svgs'
import { StayListSkeleton } from './StayListSkeleton'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export function StayList() {
    const navigate = useNavigate()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const groups = [...new Set(stays.map(stay => stay.loc.city))]
    if (isLoading) return <StayListSkeleton categories={groups} />

    return (
        <section className='stay-list-section main-container'>
            {groups.map(city => {
                const rowStays = stays.filter(stay => stay.loc.city === city)
                if (!rowStays.length) return null

                return (
                    <div className='stay-row' key={city}>
                        {/* We pass a function (renderControls) down to Carousel.
                            Carousel will call this function, giving us its scroll state + scroll logic.
                            Whatever JSX we return here gets rendered inside Carousel. */}
                        <Carousel
                            renderControls={({ scrollState, scrollRow }) => (
                                <div className='stay-row-header'>
                                    <h3 className="stay-list-title" onClick={() => navigate(`/explore/city/${city}`)}>{city}
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


