import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'
import { useClickOutside } from '../customHooks/useClickOutside'

export function Explore() {
    const { city } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)

    const [hoveredId, setHoveredId] = useState(null)
    const [focusedStayId, setFocusedStayId] = useState(null)
    const previewRef = useRef(null)

    useClickOutside([previewRef], () => {
        setFocusedStayId(null)
    })

    useEffect(() => {
        if (city) {
            loadStays({ city })
        } else {
            loadStays()
        }
    }, [city])

    // if (!type || city) return <ExploreSkeleton stays={stays} />
    // if (stays) return<div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

    return (
        <section className="explore-page full">
            {isLoading ? (
                <div className="loading-overlay"> <ExploreSkeleton stays={stays} /></div>

            ) : (
                <>
                    <div className="items-wrapper">

                        <h4 className='explore-title'>Over {stays?.length - 1} homes in {city}</h4>
                        {/* grid of stays */}
                        <div className="explore-grid">
                            {stays?.filter(stay => !stay.summary?.includes('[IN_PROGRESS:')).map(stay => (
                                <div className="div-for-focus"
                                    key={stay._id}
                                    onMouseEnter={() => setHoveredId(stay._id)}
                                    onMouseLeave={() => setHoveredId(null)}

                                tabIndex={0}
                                >
                                    <StayPreview key={stay._id}
                                        ref={previewRef}
                                        stay={stay}
                                        isBig={true}
                                        isFocused={focusedStayId === stay._id}
                                        // onRequestFocus={() => setFocusedStayId(stay._id)}
                                        onRequestFocus={() => {
                                            console.log('Focus requested for', stay._id)
                                            setFocusedStayId(stay._id)
                                        }}
                                    />
                                </div>

                            ))}
                        </div>
                    </div>
                    <ExploreMap tabIndex={0} locations={stays} hoveredId={hoveredId} />
                </>
            )
            }
        </section >


    )
}

