import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadStays, setFilterBy } from '../store/actions/stay.actions'

export function Explore() {
    const { type } = useParams()
    const { stays, isLoading } = useSelector(storeState => storeState.stayModule)
    // console.log('Explore render triggered', { type, stays, isLoading })
    useEffect(() => {
        // console.log('Explore type param:', type)
        if (type) {
            setFilterBy({ type })
            loadStays({ type })
        } else {
            loadStays()
        }
    }, [type])

    return (
        <section className="explore-page main-container">
            {isLoading ? (
                <h4>Loading homes...</h4>
            ) : (
                <h4>Over {stays?.length - 1} homes</h4>
            )}

            {/* grid of stays */}
        </section>


    )
}

