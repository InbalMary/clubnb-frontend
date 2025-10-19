
import { storageService } from '../async-storage.service'
import { userService } from '../user'

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
    const wishlists = await storageService.query(STORAGE_KEY_WISHLIST)
    if (!userId) return wishlists
    return wishlists.filter(wl => wl.byUser._id === userId) //??
}

function getById(wishlistId) {
    return storageService.get(STORAGE_KEY_WISHLIST, wishlistId)
}

async function remove(wishlistId) {
    await storageService.remove(STORAGE_KEY_WISHLIST, wishlistId)
}

async function save(wishlist) {
    if (wishlist._id) {
        return storageService.put(STORAGE_KEY_WISHLIST, wishlist)
    } else {
        const wishlistToSave = {
            _id: makeId(),
            title: wishlist.title || 'My wishlist',
            byUser: loggedInUser,
            stays: wishlist.stays || [],   // array of stayIds or stay objects
            createdAt: Date.now(),
        }
        return storageService.post(STORAGE_KEY_WISHLIST, wishlistToSave)
    }
}
