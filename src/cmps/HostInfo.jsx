import verified from '../assets/svgs/verified.svg'
import superhost from '../assets/svgs/superhost.svg'
import shield from '../assets/svgs/shield.svg'
import { hostSvgs, statSvgs } from './Svgs'

export function HostInfo({ host }) {
    if (!host) return null
const fallbackImgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    return (
        <section className="host-info">

            <div className="host-layout">
                <h2>Meet your host</h2>
                {/*Left column*/}
                <div className="host-left">
                    {/* Host card left */}
                    <article className="host-card">
                        {/* Left card column: avatar + name + badges */}
                        <div className='host-card-left'>
                            <div className="host-avatar-wrapper">
                                <img src={host.pictureUrl || fallbackImgUrl} alt={host.firstName || 'John'} className="host-avatar" />
                                {host.isVerified && (
                                    <span className="verified-badge">
                                        <img src={verified} alt="Verified" />
                                        {/*TODO: change to svg if possible*/}
                                    </span>
                                )}
                            </div>

                            <div className='host-card-details'>
                                <div className="host-name">
                                    <h3>{host.firstName || 'John'}</h3>
                                    {host.isSuperhost && (
                                        <span className="superhost-badge">
                                            {/*TODO: change to svg if possible*/}
                                            <img src={superhost} alt="Superhost" />
                                            Superhost
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Host card right column */}
                        <div className="host-stats">
                            <div className='stat'>
                                <span className='stat-num'>{host.numReviews || 0}</span>
                                <span>Reviews</span>
                            </div>

                            <div className='stat'>
                                <span className='stat-num'>{host.rating?.toFixed(2) || 0}
                                    <span className='rating-star'>{statSvgs.star}</span>
                                </span>
                                <span>Rating</span>
                            </div>

                            <div className='stat'>
                                <span className='stat-num'>{host.yearsHosting || 0}</span>
                                <span>Years hosting</span>
                            </div>
                        </div>
                    </article>

                    {/* Host bio */}
                    <div className="host-bio">
                        {host.personalFacts?.length > 0 && (
                            <ul className="host-facts">
                                {host.personalFacts.map((fact) => {
                                    const Icon = hostSvgs?.[fact.icon] || null
                                    return (
                                        <li key={fact.text}>
                                            <span className="fact-icon">
                                                {Icon ? <span className="fact-icon">{Icon}</span> : null}
                                            </span>
                                            <span className="fact-text">{fact.text}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}

                        {host.about && <p className="host-description">{host.about}</p>}
                    </div>
                </div>

                {/*Right Column*/}
                < div className="host-right" >
                    <div className='superhost-details'>
                        {host.isSuperhost && (
                            <>
                                <h3>{host.firstName} is a Superhost</h3>
                                <p>
                                    Superhosts are experienced, highly rated hosts who are committed
                                    to providing great stays for their guests.
                                </p>
                            </>
                        )}
                    </div>

                    {host.coHosts?.length > 0 && (
                        <div className="cohosts">
                            <h3>Co-hosts</h3>
                            <ul className="cohost-list">
                                {host.coHosts.map((cohost) => (
                                    <li key={cohost.name}>
                                        <img src={cohost.imgUrl} alt={`Co-host ${cohost.name}`} />
                                        {cohost.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="host-contact">
                        <h3>Host details</h3>
                        <p>Response rate: {host.responseRate ||100} %</p>
                        <p>Responds within {host.responseTime || 'an hour'}</p>
                    </div>
                    <button className="btn btn-gray">Message host</button>
                    <div className="safety-note">
                        <span className="shield-icon">
                            <img src={shield} alt="Safety note" />
                            {/*TODO: change to svg if possible*/}
                        </span>
                        <p>
                            To help protect your payment, always use Airbnb to send money
                            and communicate with hosts.
                        </p>
                    </div>
                </div >
            </div >

        </section >
    )
}