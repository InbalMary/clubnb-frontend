const { DEV, VITE_LOCAL } = import.meta.env

import { wishlistService as local } from './wishlist.service.local'
import { wishlistService as remote } from './wishlist.service.remote'

function getEmptyWishlist() {
    return {
        _id: '',
        title: '',
        byUser: { _id: '', fullname: '' },
        stays: [],       // array of stayIds (or objects if you choose that model)
        createdAt: '',
    }
}

// function getDefaultFilter() {
//     return {
//         userId: '',
//         title: '',
//     }
// }

const service = (VITE_LOCAL === 'true') ? local : remote
export const wishlistService = { getEmptyWishlist, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
if (DEV) window.wishlistService = wishlistService
