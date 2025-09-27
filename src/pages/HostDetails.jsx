import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export function HostDetails() {
    const navigate = useNavigate()

    const user = useSelector(storeState => storeState.userModule.user)
    // const users = useSelector(storeState => storeState.userModule.users)
    // const isLoading = useSelector(storeState => storeState.userModule.isLoading)

    // useEffect(() => {
    //     if(!user.isAdmin) navigate('/')
    // 	loadUsers()
    // }, [])

    return (<section className="host">
        <div>mini host</div>
        {user && <div>
            <h3>
                {user.fullname}
            </h3>
            <img src={user.imgUrl} style={{ width: '100px' }} />
            <pre> {JSON.stringify(user, null, 2)} </pre>
        </div>}

        <div>Dashboard</div>
        <div>Reservation filter</div>
        <div>Reservation table</div>
        <div>Listings</div>

    </section>)
}
