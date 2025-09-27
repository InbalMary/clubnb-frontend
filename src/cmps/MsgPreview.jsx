import { Link } from 'react-router-dom'

export function MsgPreview({ msg }) {
    const { byUser, aboutUser } = msg

    return <article className="msg-pmsg">
        <p>About: <Link to={`/user/${aboutUser._id}`}>{aboutUser.fullname}</Link></p>
        <p className="msg-by">By: <Link to={`/user/${byUser._id}`}>{byUser.fullname}</Link></p>
        <p className="msg-txt">{msg.txt}</p>
    </article>
}