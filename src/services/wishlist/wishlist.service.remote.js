import { httpService } from '../http.service'
import { userService } from '../user'
import { getSuggestedStayRange } from '../util.service'

export const wishlistService = {
    query,
    getById,
    save,
    remove,
}

async function query() {
    try {
        const loggedinUser = userService.getLoggedinUser()
        const userId = loggedinUser?._id || ''
        return await httpService.get(`wishlist?userId=${userId}`)
    } catch (err) {
        console.error('wishlistService: Cannot load wishlists', err)
        throw err
    }
}

async function getById(wishlistId) {
    try {
        return await httpService.get(`wishlist/${wishlistId}`)
    } catch (err) {
        console.error('wishlistService: Cannot get wishlist', err)
        throw err
    }
}

async function remove(wishlistId) {
    try {
        return await httpService.delete(`wishlist/${wishlistId}`)
    } catch (err) {
        console.error('wishlistService: Cannot remove wishlist', err)
        throw err
    }
}

async function save(wishlist) {
    try {
        if (wishlist._id) {
            return await httpService.put(`wishlist/${wishlist._id}`, wishlist)
        } else {
            const loggedinUser = userService.getLoggedinUser()
            const year = new Date().getFullYear()

            if (!loggedinUser) throw new Error('No logged-in user found')

            const wishlistToSave = {
                ...wishlist,
                byUser: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname
                },
                createdAt: wishlist.createdAt || Date.now() - 1000 * 60 * 60 * 24 * 7,
                title: wishlist.title || `${wishlist.city}, ${wishlist.country} ${year}`,
                stays: (wishlist.stays || []).map(stay => ({
                    ...stay,
                    imgUrls: stay.imgUrls || (stay.imgUrl ? [stay.imgUrl] : []),
                    summary: stay.summary || 'Beautiful stay with modern amenities.',
                    beds: stay.beds || 1,
                    rating: stay.rating || 4.85,
                    loc: stay.loc || { lat: 32.08, lng: 34.78 },
                    suggestedRange: getSuggestedStayRange(stay),
                })),
            }
            return await httpService.post('wishlist', wishlistToSave)
        }
    } catch (err) {
        console.error('wishlistService: Cannot save wishlist', err)
        throw err
    }
}


