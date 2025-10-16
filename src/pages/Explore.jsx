import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { ExploreMap } from '../cmps/ExploreMap'

export function Explore() {
    const { city, type } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    // console.log('Explore render triggered', { type, stays, isLoading })
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


    return (
        // main-container
        <section className="explore-page ">
            <div className="items-wrapper">

                {isLoading ? (
                    <h4 className='explore-title'>Loading homes...</h4>
                ) : (
                    <h4 className='explore-title'>Over {stays?.length - 1} homes</h4>
                )}
                {/* grid of stays */}
                <div className="explore-grid">
                    {stays?.map(stay => (
                        <StayPreview key={stay._id} stay={stay} isBig={true} />

                    ))}
                </div>
            </div>
            <ExploreMap locations={stays} />
        </section>


    )
}

