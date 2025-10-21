import { httpService } from '../http.service'

export const wishlistService = {
    query,
    getById,
    save,
    remove,
}

async function query(filterBy = { userId: '' }) {
    return httpService.get(`wishlist`, filterBy)
}

function getById(wishlistId) {
    return httpService.get(`wishlist/${wishlistId}`)
}

async function remove(wishlistId) {
    return httpService.delete(`wishlist/${wishlistId}`)
}
async function save(wishlist) {
    var savedWishlist
    if (wishlist._id) {
        savedWishlist = await httpService.put(`wishlist/${wishlist._id}`, wishlist)
    } else {
        savedWishlist = await httpService.post('wishlist', wishlist)
    }
    return savedWishlist
}

