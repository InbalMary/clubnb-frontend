import { addStayToWishlist, addWishlist } from "../store/actions/wishlist.actions"
import { Modal } from "./Modal"
import { useState } from "react"
import { svgControls } from '../cmps/Svgs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { createWishlistFromStay } from "../services/wishlist/wishlist.helper"

export function WishlistModal({ stay, isOpen, onClose }) {
    const navigate = useNavigate()

    const [isCreateWishlistModalOpen, setIsCreateWishlistModalOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [showInputClearBtn, setShowInputClearBtn] = useState(true)
    const wishlists = useSelector(storeState => storeState.wishlistModule.wishlists)


    async function onCreateWishlist() {
        try {
            await createWishlistFromStay(stay, newTitle)
            resetModalState()
        } catch (err) {
            // handled inside helper (toast + log)
        }
    }

    async function onSelectWishlistFromModal(wishlist) {
        try {
            const updatedWishlist = await addStayToWishlist(wishlist, stay)
            showSuccessMsg(`Added to wishlist ${updatedWishlist.title}`, stay.imgUrls?.[0])
            resetModalState()
        } catch (err) {
            console.error('Cannot add stay to wishlist', err)
            showErrorMsg('Could not add to wishlist, please try again.')
        }
    }

    function resetModalState() {
        setIsCreateWishlistModalOpen(false)
        setNewTitle('')
        setShowInputClearBtn(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <>
            {/* Wishlist select modal */}
            {!isCreateWishlistModalOpen && (
                <Modal
                    header="Save to wishlist"
                    isOpen={isOpen}
                    onClose={onClose}
                    closePosition="right"
                    className="wishlist-modal"
                    footer={
                        <button
                            onClick={() => {
                                setNewTitle(`${stay.loc.city}, ${stay.loc.country} ${new Date().getFullYear()}`)
                                setShowInputClearBtn(true)
                                setIsCreateWishlistModalOpen(true)
                            }}
                            className="create-wishlist-btn"
                        >
                            Create new wishlist
                        </button>
                    }
                >
                    <ul className="wishlist-modal-list">
                        {wishlists.map(wishlist => (
                            <li
                                key={wishlist._id}
                                onClick={() => onSelectWishlistFromModal(wishlist)}
                            >
                                <img
                                    src={wishlist.stays?.[0]?.imgUrls?.[0]}
                                    alt={wishlist.title}
                                    className="wishlist-modal-img"
                                />
                                <span className="stay-name">{wishlist.title}</span>
                            </li>
                        ))}
                    </ul>
                </Modal>
            )}

            {/* Create wishlist modal */}
            {isCreateWishlistModalOpen && (
                <Modal
                    header={
                        <>
                            <button
                                className="btn btn-transparent btn-round back"
                                onClick={() => setIsCreateWishlistModalOpen(false)}
                            >
                                {svgControls.backArrow}
                            </button>
                            <span className="creat-wishlist-modal-title">Create wishlist</span>
                        </>
                    }
                    isOpen={isCreateWishlistModalOpen}
                    onClose={() => setIsCreateWishlistModalOpen(false)}
                    className="create-wishlist-modal"
                    showCloseBtn={false}
                    footer={
                        <div className="create-footer-actions">
                            <button
                                className="btn create-cancel-btn btn-transparent"
                                onClick={() => setIsCreateWishlistModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn create-btn btn-black" onClick={onCreateWishlist}>
                                Create
                            </button>
                        </div>
                    }
                >
                    <div className="rename-input-wrapper">
                        <input
                            className="rename-input"
                            type="text"
                            value={newTitle}
                            onChange={ev => {
                                setNewTitle(ev.target.value)
                                if (ev.target.value !== '') setShowInputClearBtn(false)
                            }}
                            placeholder="Name"
                        />
                        {showInputClearBtn && newTitle && (
                            <button
                                type="button"
                                className="btn btn-gray btn-round clear-input-btn"
                                onClick={() => {
                                    setNewTitle('')
                                    setShowInputClearBtn(false)
                                }}
                            >
                                {svgControls.closeModal}
                            </button>
                        )}
                    </div>
                </Modal>
            )}
        </>
    )
}
