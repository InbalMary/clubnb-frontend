import { store } from '../../store/store'
import { wishlistService } from '../../services/wishlist'
import { ADD_WISHLIST, REMOVE_WISHLIST, SET_WISHLISTS, SET_WISHLIST, UPDATE_WISHLIST, SET_IS_LOADING } from '../reducers/wishlist.reducer'

export async function loadWishlists(userId) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const wishlists = await wishlistService.query(userId)
        store.dispatch({ type: SET_WISHLISTS, wishlists })
        return wishlists
    } catch (err) {
        console.error('Cannot load wishlists', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function loadWishlist(wishlistId) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const wishlist = await wishlistService.getById(wishlistId)
        store.dispatch({ type: SET_WISHLIST, wishlist })
        return wishlist
    } catch (err) {
        console.error('Cannot load wishlist', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function addWishlist(wishlist) {
    try {
        const savedWishlist = await wishlistService.save(wishlist)
        store.dispatch({ type: ADD_WISHLIST, wishlist: savedWishlist })
        return savedWishlist
    } catch (err) {
        console.error('Cannot add wishlist', err)
        throw err
    }
}


export async function updateWishlist(wishlist) {
    try {
        const savedWishlist = await wishlistService.save(wishlist)
        store.dispatch({ type: UPDATE_WISHLIST, wishlist: savedWishlist })
        return savedWishlist
    } catch (err) {
        console.error('Cannot update wishlist', err)
        throw err
    }
}

export async function removeWishlist(wishlistId) {
    try {
        await wishlistService.remove(wishlistId)
        store.dispatch({ type: REMOVE_WISHLIST, wishlistId })
    } catch (err) {
        console.error('Cannot remove wishlist', err)
        throw err
    }
}

export async function addStayToWishlist(wishlist, stay) {
    try {
        const updatedWishlist = {
            ...wishlist,
            stays: [...wishlist.stays, stay]
        }
        const savedWishlist = await wishlistService.save(updatedWishlist)
        store.dispatch({ type: UPDATE_WISHLIST, wishlist: savedWishlist })
        return savedWishlist
    } catch (err) {
        console.error('Cannot add stay to wishlist', err)
        throw err
    }
}

export async function removeStayFromWishlist(wishlist, stayId) {
    try {
        const updatedWishlist = {
            ...wishlist,
            stays: wishlist.stays.filter(stay => stay._id !== stayId)
        }
        const savedWishlist = await wishlistService.save(updatedWishlist)
        store.dispatch({ type: UPDATE_WISHLIST, wishlist: savedWishlist })
        return savedWishlist
    } catch (err) {
        console.error('Cannot remove stay from wishlist', err)
        throw err
    }
}