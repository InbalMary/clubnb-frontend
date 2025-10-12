import { httpService } from '../http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
}

async function query(filterBy = { txt: '', minPrice: 0 }) {
    return httpService.get(`order`, filterBy)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}
async function save(order) {
    var savedOrder
    if (order._id) {
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        savedOrder = await httpService.post('order', order)
    }
    return savedOrder
}

async function getStayById(stayId) {
    const { stayService } = await import('../stay')
    return stayService.getById(stayId)
}