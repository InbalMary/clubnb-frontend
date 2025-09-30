import { userService } from '../services/user'
import { StayPreview } from './stayPreview'
import rightPointer from '../assets/svgs/right-pointer.svg'

export function StayList({ stays, onRemoveStay, onUpdateStay }) {
    const demoTitles = ['Featured Stays', 'Top Rated', 'Beachfront', 'City Escapes', 'Nature Retreats']

    // function shouldShowActionBtns(stay) {
    //     const user = userService.getLoggedinUser()

    //     if (!user) return false
    //     if (user.isAdmin) return true
    //     return stay.owner?._id === user._id
    // }

    return (
        <section className='stay-list-section'>
            {demoTitles.map((title, idx) => { //how many rows and which header each row gets
                const rowStays = stays.slice(idx * 7, idx * 7 + 7)
                if (!rowStays.length) return null

                return (
                    <div className='stay-row' key={title}>
                        <h3 className="stay-list-title">{title}
                            <img src={rightPointer} className='right-pointer' />
                        </h3>
                        <ul className="stay-list">
                            {rowStays.map(stay => // what cards go inside the row
                                <li key={stay._id}>
                                    <StayPreview stay={stay} />
                                </li>)
                            }
                        </ul>
                    </div>
                )
            })}

        </section>
    )
}