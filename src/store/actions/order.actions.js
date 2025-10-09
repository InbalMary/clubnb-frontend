import { orderService } from '../../services/order'
import { store } from '../store'
import { ADD_ORDER, REMOVE_ORDER, SET_ORDERS, SET_ORDER, UPDATE_ORDER, SET_FILTERBY, SET_IS_LOADING, } from '../reducers/order.reducer'

export async function loadOrders(filterBy) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const orders = await orderService.query(filterBy)
        store.dispatch({ type: SET_ORDERS, orders })
        return orders
    } catch (err) {
        console.log('Cannot load orders', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function loadOrder(orderId) {
    try {
        const order = await orderService.getById(orderId)
        store.dispatch({ type: SET_ORDER, order })
    } catch (err) {
        console.log('Cannot load order', err)
        throw err
    }
}

export async function removeOrder(orderId) {
    try {
        await orderService.remove(orderId)
        store.dispatch(getCmdRemoveOrder(orderId))
    } catch (err) {
        console.log('Cannot remove order', err)
        throw err
    }
}

export async function addOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        store.dispatch(getCmdAddOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot add order', err)
        throw err
    }
}

export async function updateOrder(order) {
    try {
        const savedOrder = await orderService.save(order)
        store.dispatch(getCmdUpdateOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot save order', err)
        throw err
    }
}

export async function addOrderReview(orderId, txt) {
    try {
        const review = await orderService.addOrderReview(orderId, txt)
        store.dispatch(getCmdAddOrderReview(review))
        return review
    } catch (err) {
        console.log('Cannot add order review', err)
        throw err
    }
}

// Command Creators:
function getCmdSetOrders(orders) {
    return {
        type: SET_ORDERS,
        orders
    }
}
function getCmdSetOrder(order) {
    return {
        type: SET_ORDER,
        order
    }
}
function getCmdRemoveOrder(orderId) {
    return {
        type: REMOVE_ORDER,
        orderId
    }
}
function getCmdAddOrder(order) {
    return {
        type: ADD_ORDER,
        order
    }
}
function getCmdUpdateOrder(order) {
    return {
        type: UPDATE_ORDER,
        order
    }
}
// function getCmdAddOrderReview(review) {
//     return {
//         type: ADD_ORDER_REVIEW,
//         review
//     }
// }

export function setFilterBy(filterBy) {
    store.dispatch(getCmdSetFilterBy(filterBy))
}

function getCmdSetFilterBy(filterBy) {
    return {
        type: SET_FILTERBY,
        filterBy,
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadOrders()
    await addOrder([orderService.getEmptyOrder()])
    await addOrder(orderService.getEmptyOrder())
    // await updateOrder({
    //     _id: 'm1oC7',
    //     name: 'Order-Good',
    // })
    // await removeOrder('m1oC7')
    // TODO unit test addOrderReview
}
