import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { loadStays } from '../store/actions/stay.actions.js'
import { formatDateWithFullYear } from '../services/util.service.js'
import { DotsLoader } from '../cmps/SmallComponents.jsx'

export function ListingsPage() {
  const navigate = useNavigate()

  const stays = useSelector(state => state.stayModule.stays)
  const loggedInUser = useSelector(state => state.userModule.user)
  const isLoading = useSelector(storeState => storeState.userModule.isLoading)

  useEffect(() => {
    loadStays()
  }, [])

  const { inProgressStay, publishedListings } = useMemo(() => {
    if (!stays || !stays.length || !loggedInUser) {
      return { inProgressStay: null, publishedListings: [] }
    }

    const hostStays = stays.filter(stay => stay.host?._id === loggedInUser._id)

    const inProgress = hostStays.find(stay => stay.summary?.includes('[IN_PROGRESS:'))
    const published = hostStays.filter(stay => !stay.summary?.includes('[IN_PROGRESS:'))

    return {
      inProgressStay: inProgress,
      publishedListings: published
    }
  }, [stays, loggedInUser])

  const handleCreateListing = () => {
    if (inProgressStay) {
      const match = inProgressStay.summary?.match(/\[IN_PROGRESS:(.*?)\]/)
      const savedPath = match ? match[1] : '/stay/edit/become-a-host'
      navigate(savedPath)
    } else {
      navigate("/stay/edit")
    }
  }

  const handleContinueEditing = () => {
    if (!inProgressStay) return

    const match = inProgressStay.summary?.match(/\[IN_PROGRESS:(.*?)\]/)
    const savedPath = match ? match[1] : '/stay/edit/become-a-host'
    navigate(savedPath)
  }

  if (isLoading) return <DotsLoader />

  return (
    <div className="listing-container">
      <main className="main">
        <div className="listings-header">
          <h1 className="title">Your listings</h1>
          {(inProgressStay || publishedListings.length > 0) && (
            <button
              className="plus-btn btn btn-round"
              onClick={handleCreateListing}
              aria-label="Add new listing">
              <img src={`/img/plus.svg`} alt="create another listing" className="plus-icon" />
            </button>
          )}
        </div>

        {inProgressStay && (
          <section className="in-progress-section">
            <div
              className="listing-card in-progress-card"
              onClick={handleContinueEditing}
            >
              <div className="listing-image-placeholder">
                <div className="status-badge">
                  <span className="status-dot"></span>
                  In progress
                </div>

                {inProgressStay.imgUrls?.[0] ? (
                  <img
                    src={inProgressStay.imgUrls[0]}
                    alt="Listing preview"
                    className="listing-image"
                  />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>

              <div className="listing-details">
                <h3 className="listing-title">
                  Your {inProgressStay.type || 'Apartment'} listing started{' '}
                  {formatDateWithFullYear(inProgressStay.availableFrom)}
                </h3>
                <p className="listing-subtitle">
                  {inProgressStay.loc?.city
                    ? `Home in ${inProgressStay.loc.city}, ${inProgressStay.loc.country || ''}`
                    : 'Location not set yet'}
                </p>
              </div>
            </div>
          </section>
        )}

        {publishedListings.length > 0 && (
          <section className="listing-list-section">
            <h2 className="section-title">Published listings</h2>
            <ul className="listing-preview-list">
              {publishedListings.map((stay) => (
                <li key={stay._id} className="listing-preview">
                  <div className="listing-image-wrapper">
                    <Link to={`/stay/${stay._id}`} className="listing-link">
                      <img
                        src={
                          stay.imgUrls?.[0] ||
                          stay.imgUrl || `/img/upload-photo.svg`
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

        {!inProgressStay && publishedListings.length === 0 && (
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
        )}
      </main>
    </div>
  )
}