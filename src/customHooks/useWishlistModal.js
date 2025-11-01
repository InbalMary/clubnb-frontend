import { useState } from 'react'
import { useSelector } from 'react-redux'
import { store } from '../store/store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { removeWishlist, removeStayFromWishlist, updateWishlist, setWishlistUIState } from '../store/actions/wishlist.actions.js'
import { createWishlistFromStay, addStayToExistingWishlist, getDefaultWishlistTitle } from '../services/wishlist/wishlist.helper.js'
import { userService } from '../services/user/user.service.remote.js'

export function useWishlistModal(wishlists) {
    const ui = useSelector(storeState => storeState.wishlistModule.ui)

    const { isWishlistModalOpen,
        isCreateWishlistModalOpen,
        isSignupModalOpen,
        activeStay,
        newTitle,
        showInputClearBtn
    } = ui
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [signupModalProps, setSignupModalProps] = useState({
        title: 'Welcome to Clubnb',
        subtitle: 'Log in or sign up to save and organize your favorite stays.'
    })

    //helper dispatches to redux instead of local states setters
    function setIsWishlistModalOpen(boolean) {
        setWishlistUIState({ isWishlistModalOpen: boolean })
    }
    function setIsCreateWishlistModalOpen(boolean) {
        setWishlistUIState({ isCreateWishlistModalOpen: boolean })
    }
    function setIsSignupModalOpen(boolean) {
        setWishlistUIState({ isSignupModalOpen: boolean })
    }
    function setPendingAfterLogin(boolean) {
        setWishlistUIState({ pendingAfterLogin: boolean })
    }
    function setActiveStay(stay) {
        setWishlistUIState({ activeStay: stay })
    }
    function setNewTitle(title) {
        setWishlistUIState({ newTitle: title })
    }
    function setShowInputClearBtn(boolean) {
        setWishlistUIState({ showInputClearBtn: boolean })
    }

    async function onToggleWishlist(stay) {
        console.log('heart clicked')
        const loggedinUser = userService.getLoggedinUser()

        // If user not logged in - open signup modal
        if (!loggedinUser?._id) {
            console.log('User not logged in, opening signup modal')
            setSignupModalProps({
                title: 'Welcome to Clubnb',
                subtitle: 'Log in or sign up to save and organize your favorite stays.'
            })
            setActiveStay(stay)
            setPendingAfterLogin(true) // remember the action for after login
            setIsSignupModalOpen(true)
            return
        }

        //If stay is already saved - remove it
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
                return
            }
            //If stay not in any wishlist yet
            setActiveStay(stay)

            if (!wishlists?.length) {
                console.log('No wishlists yet, opening Create modal')
                const defaultTitle = getDefaultWishlistTitle(stay)
                setNewTitle(defaultTitle)
                setShowInputClearBtn(true)
                setIsCreateWishlistModalOpen(true)
                return
            }
            console.log('Opening Save-to-existing modal')
            setIsWishlistModalOpen(true)
        } catch (err) {
            console.error('Error toggling wishlist:', err)
            showErrorMsg('Could not update wishlist, please try again.')
        }
    }
    // AFTER LOGIN SUCCESS
    async function handlePostLoginFlow() {
        console.log('handlePostLoginFlow CALLED')

        const loggedinUser = userService.getLoggedinUser()
        const { activeStay, pendingAfterLogin } = store.getState().wishlistModule.ui

        if (!loggedinUser?._id || !pendingAfterLogin || !activeStay) {
            console.log('No pending wishlist action, skipping post-login flow')
            return
        }
        console.log('Logged in, resuming wishlist flow')
        setPendingAfterLogin(false)

        const latestWishlists = store.getState().wishlistModule.wishlists

        if (!latestWishlists?.length) {
            console.log('Opening Create-your-first-wishlist modal')
            const defaultTitle = getDefaultWishlistTitle(activeStay)
            setNewTitle(defaultTitle)
            setShowInputClearBtn(true)
            setTimeout(() => setIsCreateWishlistModalOpen(true), 50)
        } else {
            console.log('Opening Save-to-existing modal')
            setIsWishlistModalOpen(true)
        }
    }

    // CREATE / ADD / RENAME 
    async function onSelectWishlistFromModal(wishlist) {
        if (!activeStay) return
        try {
            await addStayToExistingWishlist(wishlist, activeStay)
            setIsWishlistModalOpen(false)
        } catch (err) {
            // handled inside helper
        }
    }

    async function onCreateWishlist() {
        try {
            await createWishlistFromStay(activeStay, newTitle)
            setIsCreateWishlistModalOpen(false)
            setNewTitle('')
            setShowInputClearBtn(false)
        } catch (err) {
            // handled inside helper (toast + log)
        }
    }

    async function onRenameWishlist(wishlistId, newTitle) {
        try {
            const wishlistToUpdate = wishlists.find(wl => wl._id === wishlistId)
            if (!wishlistToUpdate) throw new Error('Wishlist not found')

            const updatedWishlist = {
                ...wishlistToUpdate,
                title: newTitle.trim(),
                updatedAt: Date.now(),
            }

            const savedWishlist = await updateWishlist(updatedWishlist)
            const imgUrl = savedWishlist.stays?.[0]?.imgUrls?.[0]
            showSuccessMsg(`Wishlist renamed to "${savedWishlist.title}"`, imgUrl)
            setIsRenameModalOpen(false)
            setNewTitle('')
            setShowInputClearBtn(false)
        } catch (err) {
            console.error('Cannot rename wishlist', err)
            showErrorMsg('Could not rename wishlist, please try again.')
        }
    }


    return {
        // state
        isWishlistModalOpen,
        isCreateWishlistModalOpen,
        isRenameModalOpen,
        isDeleteModalOpen,
        isSignupModalOpen,
        activeStay,
        newTitle,
        showInputClearBtn,
        signupModalProps,
        // setters
        setIsWishlistModalOpen,
        setIsCreateWishlistModalOpen,
        setActiveStay,
        setNewTitle,
        setShowInputClearBtn,
        setIsRenameModalOpen,
        setIsDeleteModalOpen,
        setIsSignupModalOpen,
        setSignupModalProps,
        // handlers
        onToggleWishlist,
        onSelectWishlistFromModal,
        onCreateWishlist,
        onRenameWishlist,
        handlePostLoginFlow,
    }
}
