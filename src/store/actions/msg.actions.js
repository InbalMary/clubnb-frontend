import { msgService } from '../../services/msg/index'

import { store } from '../store'
import { ADD_MSG, REMOVE_MSG, SET_MSGS } from '../reducers/msg.reducer'
import { SET_SCORE } from '../reducers/user.reducer'

export async function loadMsgs() {
	try {
		const msgs = await msgService.query()
		store.dispatch({ type: SET_MSGS, msgs })
	} catch (err) {
		console.log('MsgActions: err in loadMsgs', err)
		throw err
	}
}

export async function addMsg(msg) {
	try {
		const addedMsg = await msgService.add(msg)
		store.dispatch(getActionAddMsg(addedMsg))
		// const { score } = addedMsg.byUser
		// store.dispatch({ type: SET_SCORE, score })
	} catch (err) {
		console.log('MsgActions: err in addMsg', err)
		throw err
	}
}

export async function removeMsg(msgId) {
	try {
		await msgService.remove(msgId)
		store.dispatch(getActionRemoveMsg(msgId))
	} catch (err) {
		console.log('MsgActions: err in removeMsg', err)
		throw err
	}
}
// Command Creators
export function getActionRemoveMsg(msgId) {
	return { type: REMOVE_MSG, msgId }
}
export function getActionAddMsg(msg) {
	return { type: ADD_MSG, msg }
}

// unitTestActions()
async function unitTestActions() {
	await loadMsgs()
	await addMsg({txt:'Wow',aboutUserId:'cEGYQ'})
	// await addMsg(msgService.getEmptyMsg())
	// await updateStay({
	//     _id: 'm1oC7',
	//     name: 'Stay-Good',
	// })
	// await removeStay('m1oC7')
	// TODO unit test addStayReview
}