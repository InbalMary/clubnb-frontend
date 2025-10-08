const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
    return {
        _id: '',
        name: '',
        price: 0,
        cleaningFee: 0,
        capacity: 1,
        bedrooms: 1,
        bathrooms: 1,
        summary: '',
        startDate: '',
        endDate: '',
        imgUrls: [],
        host: {
            _id: '',
            fullname: '',
            location: ''
        },
        loc: {
            country: '',
            city: '',
            address: ''
        },
        reviews: [],
        likedByUsers: []
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        minPrice: '',
        sortField: '',
        sortDir: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
