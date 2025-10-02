import { Fragment } from "react"
import { useKeyListener } from "../customHooks/useKeyListener"
export function Modal({ header, children, isOpen, onClose }) {

    useKeyListener('Escape', () => {
        onClose()
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <Fragment>

            <section onClick={onClose} className="backdrop"></section>
            <section className="modal-popup">
                <header>{header}</header>
                <main>{children}</main>
            </section>

        </Fragment>
    )
}
