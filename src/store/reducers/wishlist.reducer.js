import { demoWishlists } from "../../data/demo-wishlist"

export const SET_WISHLISTS = 'SET_WISHLISTS'
export const SET_WISHLIST = 'SET_WISHLIST'
export const ADD_WISHLIST = 'ADD_WISHLIST'
export const UPDATE_WISHLIST = 'UPDATE_WISHLIST'
export const REMOVE_WISHLIST = 'REMOVE_WISHLIST'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    wishlists: demoWishlists,
    wishlist: null, //current wishlist
    isLoading: false,
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

        case SET_IS_LOADING:
            newState = { ...state, isLoading: action.isLoading }
            break

        default:
            return state
    }
    return newState
}