import { stayService } from '../../services/stay'
import { store } from '../store'
import { 
    ADD_STAY, 
    REMOVE_STAY, 
    SET_STAYS, 
    SET_STAY, 
    UPDATE_STAY, 
    ADD_STAY_REVIEW, 
    SET_FILTERBY, 
    SET_IS_LOADING,
    ADD_STAY_MSG,
    REMOVE_STAY_MSG,
    SET_STAY_MSGS
} from '../reducers/stay.reducer'

export async function loadStays(filterBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const stays = await stayService.query(filterBy)
        store.dispatch(getCmdSetStays(stays))
    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    } finally {
        setTimeout(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        }, 500)
    }
}

export async function loadStay(stayId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    try {
        const stay = await stayService.getById(stayId)
        // store.dispatch(getCmdSetStay(stay))
        store.dispatch({
            type: SET_STAY,
            stay
        })
    } catch (err) {
        console.log('Cannot load stay', err)
        throw err
    } finally {
        setTimeout(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        }, 350)
    }
}


export async function removeStay(stayId) {
    try {
        await stayService.remove(stayId)
        store.dispatch(getCmdRemoveStay(stayId))
    } catch (err) {
        console.log('Cannot remove stay', err)
        throw err
    }
}

export async function addStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add stay', err)
        throw err
    }
}

export async function updateStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        store.dispatch(getCmdUpdateStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot save stay', err)
        throw err
    }
}

export async function addStayReview(stayId, txt) {
    try {
        const review = await stayService.addStayReview(stayId, txt)
        store.dispatch(getCmdAddStayReview(review))
        return review
    } catch (err) {
        console.log('Cannot add stay review', err)
        throw err
    }
}

// MESSAGE ACTIONS

export async function loadStayMsgs(stayId) {
    try {
        const msgs = await stayService.getStayMsgs(stayId)
        store.dispatch(getCmdSetStayMsgs(msgs))
        return msgs
    } catch (err) {
        console.log('Cannot load stay messages', err)
        throw err
    }
}

export async function addStayMsg(stayId, txt) {
    try {
        // console.log('Sending message to:', stayId, 'Text:', txt) 
        const msg = await stayService.addStayMsg(stayId, txt)
        // console.log('Message saved:', msg) 
        store.dispatch(getCmdAddStayMsg(msg))
        return msg
    } catch (err) {
        console.error('Cannot add stay message', err)
        throw err
    }
}

export async function removeStayMsg(stayId, msgId) {
    try {
        await stayService.removeStayMsg(stayId, msgId)
        store.dispatch(getCmdRemoveStayMsg(msgId))
    } catch (err) {
        console.log('Cannot remove stay message', err)
        throw err
    }
}

// Command Creators
function getCmdSetStays(stays) {
    return {
        type: SET_STAYS,
        stays
    }
}

function getCmdSetStay(stay) {
    return {
        type: SET_STAY,
        stay
    }
}

function getCmdRemoveStay(stayId) {
    return {
        type: REMOVE_STAY,
        stayId
    }
}

function getCmdAddStay(stay) {
    return {
        type: ADD_STAY,
        stay
    }
}

function getCmdUpdateStay(stay) {
    return {
        type: UPDATE_STAY,
        stay
    }
}

function getCmdAddStayReview(review) {
    return {
        type: ADD_STAY_REVIEW,
        review
    }
}

function getCmdSetStayMsgs(msgs) {
    return {
        type: SET_STAY_MSGS,
        msgs
    }
}

function getCmdAddStayMsg(msg) {
    return {
        type: ADD_STAY_MSG,
        msg
    }
}

function getCmdRemoveStayMsg(msgId) {
    return {
        type: REMOVE_STAY_MSG,
        msgId
    }
}

export function setFilterBy(filterBy) {
    store.dispatch(getCmdSetFilterBy(filterBy))
}

function getCmdSetFilterBy(filterBy) {
    return {
        type: SET_FILTERBY,
        filterBy,
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadStays()
    await addStay([stayService.getEmptyStay()])
    await addStay(stayService.getEmptyStay())
    // await updateStay({
    //     _id: 'm1oC7',
    //     name: 'Stay-Good',
    // })
    // await removeStay('m1oC7')
    // TODO unit test addStayReview
}
