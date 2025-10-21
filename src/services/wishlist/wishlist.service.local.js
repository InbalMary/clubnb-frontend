
import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { demoWishlists } from "../../data/demo-wishlist"
import { makeId } from '../util.service'

const STORAGE_KEY_WISHLIST = 'wishlist'

if (!localStorage.getItem(STORAGE_KEY_WISHLIST)) {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(demoWishlists))
}

export const wishlistService = {
    query,
    getById,
    save,
    remove,
}
window.cs = wishlistService


async function query(userId) {
    const wishlists = await storageService.query(STORAGE_KEY_WISHLIST) || []
    if (!userId) return wishlists
    return wishlists.filter(wishlist => wishlist.byUser._id === userId)
}

function getById(wishlistId) {
    return storageService.get(STORAGE_KEY_WISHLIST, wishlistId)
}

async function remove(wishlistId) {
    const wishlists = await storageService.query(STORAGE_KEY_WISHLIST) || []
    const updatedWishlists = wishlists.filter(wl => wl._id !== wishlistId)
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(updatedWishlists))
    return updatedWishlists
}

async function save(wishlist) {
    if (wishlist._id) {
        const updatedWishlist = {
            ...wishlist,
            updatedAt: Date.now(),
        }
        return storageService.put(STORAGE_KEY_WISHLIST, updatedWishlist)
    } else {
        const loggedinUser = userService.getLoggedinUser()
        const year = new Date().getFullYear()

        const wishlistToSave = {
            _id: makeId(),
            byUser: loggedinUser,
            createdAt: Date.now(),
            stays: wishlist.stays || [],
            city: wishlist.city || '',
            country: wishlist.country || '',
            title: wishlist.title || `${wishlist.city}, ${wishlist.country} ${year}`,
            ...wishlist,
        }
        return storageService.post(STORAGE_KEY_WISHLIST, wishlistToSave)
    }
}
