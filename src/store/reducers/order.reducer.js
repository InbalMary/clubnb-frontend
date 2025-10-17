export const SET_ORDERS = 'SET_ORDERS'
export const SET_ORDER = 'SET_ORDER'
export const SET_CURRENT_ORDER = 'SET_CURRENT_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const ADD_ORDER = 'ADD_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
// export const ADD_ORDER_REVIEW = 'ADD_ORDER_REVIEW'
export const SET_FILTERBY = 'SET_FILTERBY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    orders: [],
    order: null, //order that is already in db
    currentOrder: null, //order currently in checkout flow
    filterBy: {},
    isLoading: false,
}

export function orderReducer(state = initialState, action) {
    var newState = state
    var orders
    switch (action.type) {
        case SET_ORDERS:
            newState = { ...state, orders: action.orders }
            break
        case SET_ORDER:
            newState = { ...state, order: action.order }
            break
        case SET_CURRENT_ORDER:
            newState = { ...state, currentOrder: action.order }
            break
        case SET_FILTERBY:
            newState = { ...state, filterBy: { ...state.filterBy, ...action.filterBy }, }
            break
        case REMOVE_ORDER:
            const lastRemovedOrder = state.orders.find(order => order._id === action.orderId)
            orders = state.orders.filter(order => order._id !== action.orderId)
            newState = { ...state, orders, lastRemovedOrder }
            break
        case ADD_ORDER:
            newState = { ...state, orders: [...state.orders, action.order] }
            break
        case UPDATE_ORDER:
            orders = state.orders.map(order => (order._id === action.order._id) ? action.order : order)
            newState = { ...state, orders }
            break
        case SET_IS_LOADING:
            newState = { ...state, isLoading: action.isLoading }
            break
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const order1 = { _id: 'b101', name: 'Order ' + parseInt('' + Math.random() * 10), price: 12, owner: null, reviews: [] }
    const order2 = { _id: 'b102', name: 'Order ' + parseInt('' + Math.random() * 10), price: 13, owner: null, reviews: [] }

    state = orderReducer(state, { type: SET_ORDERS, orders: [order1] })
    console.log('After SET_ORDERS:', state)

    state = orderReducer(state, { type: ADD_ORDER, order: order2 })
    console.log('After ADD_ORDER:', state)

    state = orderReducer(state, { type: UPDATE_ORDER, order: { ...order2, name: 'Good' } })
    console.log('After UPDATE_ORDER:', state)

    state = orderReducer(state, { type: REMOVE_ORDER, orderId: order2._id })
    console.log('After REMOVE_ORDER:', state)

    state = orderReducer(state, { type: SET_ORDER, order: order1 })
    console.log('After SET_ORDER:', state)

    const review = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some review', by: { _id: 'u123', fullname: 'test' } }
    state = orderReducer(state, { type: ADD_ORDER_REVIEW, orderId: order1._id, review })
    console.log('After ADD_ORDER_REVIEW:', state)
}

