
import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { demoWishlists } from "../../data/demo-wishlist"
import { makeId, getSuggestedStayRange } from '../util.service'

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
    let wishlists = await storageService.query(STORAGE_KEY_WISHLIST) || []
    wishlists = wishlists.map(wl => ({
        ...wl,
        stays: (wl.stays || []).map(stay => ({
            ...stay,
            suggestedRange: stay.suggestedRange || getSuggestedStayRange(stay),
        })),
    }))
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
            stays: (wishlist.stays || []).map(stay => ({
                ...stay,
                imgUrls: stay.imgUrls || (stay.imgUrl ? [stay.imgUrl] : []),
                summary: stay.summary || 'Beautiful stay with modern amenities.',
                beds: stay.beds || 1,
                rating: stay.rating || 4.85,
                loc: stay.loc || { lat: 32.08, lng: 34.78 }, // temporary placeholder
                suggestedRange: getSuggestedStayRange(stay),
            }))
        }
        return storageService.put(STORAGE_KEY_WISHLIST, updatedWishlist)
    } else {
        const loggedinUser = userService.getLoggedinUser()
        const year = new Date().getFullYear()

        const wishlistToSave = {
            _id: makeId(),
            byUser: loggedinUser,
            createdAt: Date.now(),
            stays: (wishlist.stays || []).map(stay => ({
                ...stay,
                imgUrls: stay.imgUrls || (stay.imgUrl ? [stay.imgUrl] : []),
                summary: stay.summary || 'Beautiful stay with modern amenities.',
                beds: stay.beds || 1,
                rating: stay.rating || 4.85,
                loc: stay.loc || { lat: 32.08, lng: 34.78 },
                suggestedRange: getSuggestedStayRange(stay),
            })),
            city: wishlist.city || '',
            country: wishlist.country || '',
            title: wishlist.title || `${wishlist.city}, ${wishlist.country} ${year}`,
            ...wishlist,
        }
        return storageService.post(STORAGE_KEY_WISHLIST, wishlistToSave)
    }
}
