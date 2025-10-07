import { Fragment } from "react"
import { useKeyListener } from "../customHooks/useKeyListener"
import { svgControls } from "./Svgs"
import { Footer } from "react-day-picker"

export function Modal({ header, footer, children, isOpen, onClose, closePosition = 'left', className, useBackdrop = true }) {

    useKeyListener('Escape', () => {
        onClose()
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <Fragment>
            {useBackdrop && <section onClick={onClose} className="backdrop"></section>}

            <section className={`modal-popup ${className || ''}`}>
                {closePosition === 'left' || closePosition === 'right' &&
                    <button
                        onClick={onClose}
                        className={`close-btn ${closePosition}`}
                        aria-label="Close modal"
                    > {svgControls.closeModal}
                    </button>
                }
                {header && <header>{header}</header>}
                <main className="main-modal">{children}</main>
                {footer && <footer>{footer}</footer>}

            </section>

        </Fragment>
    )
}
