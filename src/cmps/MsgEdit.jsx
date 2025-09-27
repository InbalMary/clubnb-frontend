import { useState } from "react"
import { useSelector } from "react-redux"

import { addMsg } from "../store/actions/msg.actions"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function MsgEdit() {
	const users = useSelector(storeState => storeState.userModule.users)
	const [msgToEdit, setMsgToEdit] = useState({ txt: '', aboutUserId: '' })

	function handleChange(ev) {
		const { name, value } = ev.target
		setMsgToEdit({ ...msgToEdit, [name]: value })
	}

    async function onAddMsg(ev) {
		ev.preventDefault()
		if (!msgToEdit.txt || !msgToEdit.aboutUserId) return alert('All fields are required')
            
		try {
			await addMsg(msgToEdit)
			showSuccessMsg('Msg added')
			setMsgToEdit({ txt: '', aboutUserId: '' })
		} catch (err) {
			showErrorMsg('Cannot add msg')
		}
	}

   return <form className="msg-edit" onSubmit={onAddMsg}>
        <select onChange={handleChange} value={msgToEdit.aboutUserId} name="aboutUserId">
            <option value="">Msg about...</option>
            {users.map(user =>
                <option key={user._id} value={user._id}>
                    {user.fullname}
                </option>
            )}
        </select>
        <textarea name="txt" onChange={handleChange} value={msgToEdit.txt}></textarea>
        <button>Add</button>
    </form>

}