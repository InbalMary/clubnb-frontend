import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'
import { StayPreview } from '../cmps/StayPreview'
import { capitalizeFirst } from '../services/util.service'

export function Explore() {
    const { city, type } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    // console.log('Explore render triggered', { type, stays, isLoading })
    useEffect(() => {
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
        <section className="explore-page">

            {isLoading ? (
                <h4 className='explore-title'>Loading homes...</h4>
            ) : (
                <h4 className='explore-title'>Over {stays?.length - 1} homes in {capitalizeFirst(city)}</h4>
            )}
            {/* grid of stays */}
            <div className="explore-grid">
                {stays?.map(stay => (
                    <StayPreview key={stay._id} stay={stay} isBig={true} />

                ))}
            </div>
        </section>


    )
}

