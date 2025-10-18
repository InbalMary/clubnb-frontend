import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'
import { ExploreSkeleton } from '../cmps/SmallComponents'

export function Explore() {
    const { city, type } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    // console.log('Explore render triggered', { type, stays, isLoading })
    const [hoveredId, setHoveredId] = useState(null)

    useEffect(() => {
        console.log('Explore type param:', type)
        if (type) {
            setFilterBy({ type })
            loadStays({ type })
        } else if (city) {
            setFilterBy({ city })
            loadStays({ city })
        } else {
            loadStays()
        }
    }, [type, city])

    // if (!type || city) return <ExploreSkeleton stays={stays} />

    return (
        // main-container
        <section className="explore-page ">
            <div className="items-wrapper">

                {isLoading ? (
                    <ExploreSkeleton stays={stays} />
                ) : (
                    <h4 className='explore-title'>Over {stays?.length - 1} homes</h4>
                )}
                {/* grid of stays */}
                <div className="explore-grid">
                    {stays?.map(stay => (
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
        </section>


    )
}

