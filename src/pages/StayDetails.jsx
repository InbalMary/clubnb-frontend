import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'


export function StayDetails() {

  const {stayId} = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  async function onAddStayReview(stayId) {
    try {
        await addStayReview(stayId, 'bla bla ' + parseInt(Math.random()*10))
        showSuccessMsg(`Stay review added`)
    } catch (err) {
        showErrorMsg('Cannot add stay review')
    }        

}

  return (
    <section className="stay-details">
      <Link to="/stay">Back to list</Link>
      <h1>Stay Details</h1>
      {stay && <div>
        <h3>{stay.name}</h3>
        <h4>{stay.price} KMH</h4>
        <pre> {JSON.stringify(stay, null, 2)} </pre>
      </div>
      }
      <button onClick={() => { onAddStayReview(stay._id) }}>Add stay review</button>

    </section>
  )
}