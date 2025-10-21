import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'

export function Explore() {
    const { city } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    const [hoveredId, setHoveredId] = useState(null)

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
                                <div
                                    key={stay._id}
                                    onMouseEnter={() => setHoveredId(stay._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <StayPreview key={stay._id} stay={stay} isBig={true} />
                                </div>

                            ))}
                        </div>
                    </div>
                    <ExploreMap locations={stays} hoveredId={hoveredId} />
                </>
            )
            }
        </section >


    )
}

