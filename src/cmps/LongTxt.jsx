import { useState } from 'react'
export function LongTxt({ children, length = 100 }) {
    const txt = children


    const isLongText = txt.length > length
    const textToShow = !isLongText ? txt : (txt.substring(0, length)) + '...'
    return (
        <section className={`summary`}>
            <p>{textToShow}
            </p>
        </section>
    )
}