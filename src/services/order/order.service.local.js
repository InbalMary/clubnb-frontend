
import { storageService } from '../async-storage.service'
import { stayService } from '../stay/stay.service.local.js'
import { formatName, makeId } from '../util.service'
import { userService } from '../user'
import { demoOrders } from '../../data/demo-orders'

const STORAGE_KEY_ORDER = 'order'

if (!localStorage.getItem(STORAGE_KEY_ORDER)) {
    localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(demoOrders))
}

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
}
window.cs = orderService


async function query(filterBy = getDefaultFilter()) {
    return storageService.query(STORAGE_KEY_ORDER)
}

function getById(orderId) {
    return storageService.get(STORAGE_KEY_ORDER, orderId)
}

async function remove(orderId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY_ORDER, orderId)
}

async function save(order) {
    if (order._id) {
        return storageService.put(STORAGE_KEY_ORDER, order)
    } else {
        const orderToSave = {
            _id: order._id || makeId(),
            hostId: order.hostId,
            guest: order.guest,
            guestId: order.guest?._id || order.guestId,
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            stay: order.stay,
            msgs: order.msgs || [],
            status: order.status || 'pending',
            bookedAt: order.bookedAt || new Date().toISOString()
        }
        return storageService.post(STORAGE_KEY_ORDER, orderToSave)
    }
}

async function getStayById(stayId) {
    return stayService.getById(stayId)
}

function getDefaultFilter() {
    return {
        _id: '',
        hostId: '',
        guestId: '',
        status: '',
        startDate: '',
        endDate: '',
        guests: { adults: 0, kids: 0, infants: 0, pets: 0 },
        stayId: '',
        totalPriceMin: 0,
        totalPriceMax: 0,
        bookedAt: '',
    }
}