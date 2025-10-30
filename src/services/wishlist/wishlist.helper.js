import { addWishlist, addStayToWishlist } from "../../store/actions/wishlist.actions"
import { showSuccessMsg, showErrorMsg } from "../event-bus.service"

/**
 * Creates a new wishlist based on a stay and optional title.
 * Returns the saved wishlist if successful.
 */
export async function createWishlistFromStay(stay, newTitle = '') {
    try {
        const year = new Date().getFullYear()
        const title = newTitle?.trim()
            ? newTitle
            : `${stay.loc.city}, ${stay.loc.country} ${year}`

        const newWishlist = {
            title,
            city: stay.loc.city,
            country: stay.loc.country,
            stays: [
                {
                    _id: stay._id,
                    name: stay.name,
                    imgUrls: stay.imgUrls || [],
                    summary: stay.summary,
                    beds: stay.beds,
                    rating: stay.host?.rating || 4.85,
                },
            ],
            createdAt: Date.now(),
        }

        const savedWishlist = await addWishlist(newWishlist)
        showSuccessMsg(`Created wishlist ${savedWishlist.title}`, stay.imgUrls?.[0])
        return savedWishlist
    } catch (err) {
        console.error('Cannot create wishlist', err)
        showErrorMsg('Could not create wishlist, please try again.')
        throw err
    }
}

export async function addStayToExistingWishlist(wishlist, stay) {
    try {
        const updatedWishlist = await addStayToWishlist(wishlist, stay)
        showSuccessMsg(`Added to wishlist ${updatedWishlist.title}`, stay.imgUrls?.[0])
        return updatedWishlist
    } catch (err) {
        console.error('Cannot add stay to wishlist', err)
        showErrorMsg('Could not add stay to wishlist, please try again.')
        throw err
    }
}
