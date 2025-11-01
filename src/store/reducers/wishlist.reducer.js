// import { demoWishlists } from "../../data/demo-wishlist"

export const SET_WISHLISTS = 'SET_WISHLISTS'
export const SET_WISHLIST = 'SET_WISHLIST'
export const ADD_WISHLIST = 'ADD_WISHLIST'
export const UPDATE_WISHLIST = 'UPDATE_WISHLIST'
export const REMOVE_WISHLIST = 'REMOVE_WISHLIST'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const CLEAR_WISHLISTS = 'CLEAR_WISHLISTS'
export const SET_WISHLIST_UI_STATE = 'SET_WISHLIST_UI_STATE'

const initialState = {
    wishlists: [],
    wishlist: null, //current wishlist
    isLoading: false,
    ui: {
        isWishlistModalOpen: false,
        isCreateWishlistModalOpen: false,
        isSignupModalOpen: false,
        activeStay: null,
        pendingAfterLogin: false,
        newTitle: '',
        showInputClearBtn: false,
    }
}

export function wishlistReducer(state = initialState, action = {}) {
    var newState = state
    switch (action.type) {
        case SET_WISHLISTS:
            newState = { ...state, wishlists: action.wishlists }
            break

        case SET_WISHLIST:
            newState = { ...state, wishlist: action.wishlist }
            break

        case ADD_WISHLIST:
            newState = { ...state, wishlists: [...state.wishlists, action.wishlist] }
            break

        case UPDATE_WISHLIST:
            newState = {
                ...state,
                wishlists: state.wishlists.map(wl =>
                    wl._id === action.wishlist._id ? action.wishlist : wl
                )
            }
            break

        case REMOVE_WISHLIST:
            newState = {
                ...state,
                wishlists: state.wishlists.filter(wl => wl._id !== action.wishlistId)
            }
            break

        case CLEAR_WISHLISTS:
            newState = {
                ...state,
                wishlists: [],
                wishlist: null,
                isLoading: false,
            }
            break


        case SET_WISHLIST_UI_STATE:
            newState = {
                ...state,
                ui: { ...state.ui, ...action.ui }
            }
            break

        case SET_IS_LOADING:
            newState = { ...state, isLoading: action.isLoading }
            break

        default:
            return state
    }
    return newState
}