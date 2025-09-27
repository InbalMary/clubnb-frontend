import { storageService } from '../async-storage.service'
import { userService } from '../user'

export const msgService = {
	add,
	query,
	remove,
}

function query(filterBy) {
	return storageService.query('msg')
}

async function remove(msgId) {
	await storageService.remove('msg', msgId)
}

async function add({ txt, aboutUserId }) {
	const aboutUser = await userService.getById(aboutUserId)
	const msgToAdd = {
		txt,
		byUser: userService.getLoggedinUser(),
		aboutUser: {
			_id: aboutUser._id,
			fullname: aboutUser.fullname,
			imgUrl: aboutUser.imgUrl,
		},
	}

	// msgToAdd.byUser.score += 10
	await userService.update(msgToAdd.byUser)

	const addedMsg = await storageService.post('msg', msgToAdd)
	return addedMsg
}