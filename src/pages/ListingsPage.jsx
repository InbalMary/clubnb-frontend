import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { loadStays } from '../store/actions/stay.actions.js'

export function ListingsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const stays = useSelector(state => state.stayModule.stays)
  const loggedInUser = useSelector(state => state.userModule.loggedInUser)

  useEffect(() => {
    loadStays()
  }, [])

  const hostListings = useMemo(() => {
    // For now, return all stays..
    if (!stays || !stays.length) return []
    // return stays

    if (!loggedInUser) return []
    return stays.filter(stay => stay.host._id === loggedInUser._id)
  }, [stays, loggedInUser])

  const handleCreateListing = () => {
    navigate("/stay/edit")
    console.log('Creating new listing...')
  }

  return (
    <div className="listing-container">
      <main className="main">
        <h1 className="title">Your listings</h1>

        {hostListings.length === 0 ? (
          <div className="empty-state">
            <div className="icon-container">
              <img
                className="house-icon"
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240"
                alt="House icon"
              />
            </div>

            <p className="empty-text">
              Create a listing with Clubnb Setup and start getting booked.
            </p>

            <button onClick={handleCreateListing} className="btn create-button">
              Create listing
            </button>
          </div>
        ) : (
          <section className="listing-list-section">
            <ul className="listing-preview-list">
              {hostListings.map((stay) => (
                <li key={stay._id} className="listing-preview">
                  <div className="listing-image-wrapper">
                    <Link to={`/stay/${stay._id}`} className="listing-link">
                      <img
                        src={
                          stay.imgUrls?.[0] ||
                          stay.imgUrl ||
                          'https://picsum.photos/300/300?random=2'
                        }
                        alt={stay.name}
                        className="listing-image"
                      />
                    </Link>
                  </div>

                  <div className="listing-info">
                    <header>
                      <Link to={`/stay/${stay._id}`} className="listing-name">
                        {stay.name}
                      </Link>
                    </header>
                    <p className="listing-location">
                      {stay.loc?.city || 'Unknown location'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}