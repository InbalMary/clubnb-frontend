import { Fragment, useEffect, useState } from "react"
import { useKeyListener } from "../customHooks/useKeyListener"
import { svgControls } from "./Svgs"
import { Footer } from "react-day-picker"

export function Modal({ header, footer, children, isOpen, onClose, closePosition = 'left', className, useBackdrop = true }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        let timeout

        if (isOpen) {
            setIsVisible(true)
        } else {
            timeout = setTimeout(() => {
                setIsVisible(false) 
            }, 350)
        }

        return () => clearTimeout(timeout)
    }, [isOpen])

    useKeyListener('Escape', () => {
        onClose()
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <Fragment>
            {useBackdrop && <section onClick={onClose} className="backdrop"></section>}

            <section className={`modal-popup ${className || ''} ${isVisible ? 'open' : 'closed'}`}>
                <button
                    onClick={onClose}
                    className={`close-btn ${closePosition}`}
                    aria-label="Close modal"
                > {svgControls.closeModal}
                </button>

                {header && <header>{header}</header>}
                <main className="main-modal">{children}</main>
                {footer && <footer>{footer}</footer>}

            </section>

        </Fragment>
    )
}
