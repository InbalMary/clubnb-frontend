const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service'

import { orderService as local } from './order.service.local'
import { orderService as remote } from './order.service.remote'

function getEmptyOrder() {
    return {
        _id: '',
        hostId: { _id: '', fullname: '', imgUrl: '' },
        guest: { _id: '', fullname: '' },
        totalPrice: 0,
        startDate: '',
        endDate: '',
        guests: { adults: 0, kids: 0, infants: 0, pets: 0 },
        stay: { _id: '', name: '', price: 0, imgUrl: '' },
        msgs: [],
        status: '',
        bookedAt: '',
    }
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

const service = (VITE_LOCAL === 'true') ? local : remote
export const orderService = { getEmptyOrder, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.orderService = orderService