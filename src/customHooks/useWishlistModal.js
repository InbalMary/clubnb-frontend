import { useState } from 'react'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { addWishlist, addStayToWishlist, removeWishlist, removeStayFromWishlist } from '../store/actions/wishlist.actions.js'
import { useNavigate } from 'react-router-dom'

export function useWishlistModal(wishlists) {
    const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false)
    const [isCreateWishlistModalOpen, setIsCreateWishlistModalOpen] = useState(false)
    const [activeStay, setActiveStay] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [showInputClearBtn, setShowInputClearBtn] = useState(true)
    const navigate = useNavigate()

    async function onToggleWishlist(stay) {
        console.log('heart clicked')

        const isAddedToWishlist = wishlists.some(wl =>
            wl.stays.some(stayInList => stayInList._id === stay._id)
        )

        try {
            if (isAddedToWishlist) {
                const wishlistWithStay = wishlists.find(wishlist =>
                    wishlist.stays.some(stayInList => stayInList._id === stay._id))

                if (!wishlistWithStay) return

                if (wishlistWithStay.stays.length === 1) {
                    await removeWishlist(wishlistWithStay._id)
                    console.log('Removed entire wishlist', wishlistWithStay._id)
                    showSuccessMsg(`Wishlist ${wishlistWithStay.title} deleted`, stay.imgUrls?.[0])
                } else {
                    await removeStayFromWishlist(wishlistWithStay, stay._id)
                    console.log(stay._id, 'removed from wishlist')
                    showSuccessMsg(`Removed from wishlist ${wishlistWithStay.title}`, stay.imgUrls?.[0])
                }

            } else {
                setActiveStay(stay)
                setIsWishlistModalOpen(true)
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err)
            showErrorMsg('Could not update wishlist, please try again.')
        }
    }

    async function onSelectWishlistFromModal(wishlist) {
        if (!activeStay) return
        try {
            const updatedWishlist = await addStayToWishlist(wishlist, activeStay)
            setIsWishlistModalOpen(false)
            showSuccessMsg(`Added to wishlist ${updatedWishlist.title}`, activeStay.imgUrls?.[0])
            navigate('/wishlists') //Temporary navigate
        } catch (err) {
            console.error('Cannot add stay to wishlist', err)
            showErrorMsg('Could not add to wishlist, please try again.')
        }
    }


    async function onCreateWishlist() {
        try {
            const year = new Date().getFullYear()
            const title = newTitle?.trim() ? newTitle : `${activeStay.loc.city}, ${activeStay.loc.country} ${year}`
            const newWishlist = {
                title,
                city: activeStay.loc.city,
                country: activeStay.loc.country,
                stays: [
                    {
                        _id: activeStay._id,
                        name: activeStay.name,
                        imgUrls: activeStay.imgUrls || [],
                        summary: activeStay.summary,
                        beds: activeStay.beds,
                        rating: activeStay.host?.rating
                    }
                ],
                createdAt: Date.now(),
            }
            const savedWishlist = await addWishlist(newWishlist)
            console.log(`${activeStay.name} was added to wishlist ${savedWishlist.title}`)
            showSuccessMsg(`Created wishlist ${savedWishlist.title}`, activeStay.imgUrls?.[0])
            navigate('/wishlists') //Temporary navigate
            setIsCreateWishlistModalOpen(false)
            setNewTitle('')
            setShowInputClearBtn(false)
        } catch (err) {
            console.error('Cannot create wishlist', err)
            showErrorMsg('Could not create wishlist, please try again.')
        }
    }

    return {
        // state
        isWishlistModalOpen,
        isCreateWishlistModalOpen,
        activeStay,
        newTitle,
        showInputClearBtn,
        // setters
        setIsWishlistModalOpen,
        setIsCreateWishlistModalOpen,
        setActiveStay,
        setNewTitle,
        setShowInputClearBtn,
        // handlers
        onToggleWishlist,
        onSelectWishlistFromModal,
        onCreateWishlist
    }
}
