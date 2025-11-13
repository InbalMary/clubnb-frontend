import { httpService } from '../http.service'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayReview,
    getStayMsgs,
    addStayMsg,
    removeStayMsg,
    getUserConversations,
}

async function query(filterBy = { txt: '', minPrice: 0 }) {
    return httpService.get(`stay`, filterBy)
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}
async function save(stay) {
    var savedStay
    if (stay._id) {
        savedStay = await httpService.put(`stay/${stay._id}`, stay)
    } else {
        savedStay = await httpService.post('stay', stay)
    }
    return savedStay
}

async function addStayReview(stayId, txt) {
    const savedReview = await httpService.post(`stay/${stayId}/review`, { txt })
    return savedReview
}

async function addStayMsg(stayId, msgData) {
    try {
        const msg = await httpService.post(`${STORAGE_KEY}/${stayId}/msg`, msgData)
        return msg
    } catch (err) {
        console.error('Failed to add stay message:', err)
        throw err
    }
}

async function getStayMsgs(stayId) {
    try {
        const stay = await getById(stayId)
        return stay.msgs || []
    } catch (err) {
        console.error('Failed to get stay messages:', err)
        throw err
    }
}

async function getUserConversations() {
    return httpService.get(`${STORAGE_KEY}/user/conversations`)
}

async function removeStayMsg(stayId, msgId) {
    return httpService.delete(`${STORAGE_KEY}/${stayId}/msg/${msgId}`)
}