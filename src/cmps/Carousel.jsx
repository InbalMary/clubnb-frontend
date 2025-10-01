import { useState, useEffect, useRef } from 'react'
import arrowRight from '../assets/svgs/right-carousel.svg'
import arrowLeft from '../assets/svgs/left-carousel.svg'

export function Carousel({ children, renderControls }) {
    const rowRef = useRef(null) //  Make a ref that will hold a single <ul> element, a row
    const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false })// tracking which row can scroll left/right


    function updateScroll() {
        const rowEl = rowRef.current
        if (!rowEl) return

        const atStart = rowEl.scrollLeft <= 0
        const atEnd = rowEl.scrollLeft + rowEl.clientWidth >= rowEl.scrollWidth
        //rowEl.clientWidth: visible width of the row.
        //rowEl.scrollWidth: full width of all children combined.
        //scrollLeft = built-in. how many pixels the content is scrolled from its left edge (0 = fully left, increases as you scroll right)
        setScrollState({ atStart, atEnd })
        // console.log('Updated scrollState:', { atStart, atEnd })
    }

    //Function to scroll one row left/right
    function scrollRow(direction) {
        const rowEl = rowRef.current
        if (rowEl) {
            // console.log('scrollRow called, direction:', direction, 'current scrollLeft:', rowEl.scrollLeft)
            rowEl.scrollLeft += direction * 250 // move by one card width. 
            updateScroll() // after moving, refresh the state
        }
    }

    useEffect(() => { // every time children change, check scroll state if is start or end
        updateScroll()
    }, [children])

    return (
        <div className="carousel">
            {/* If the parent gave us renderControls, call it with our state + helpers.
                This lets the parent decide how/where to render the controls. */}
            {renderControls && renderControls({ scrollState, scrollRow })}
            <ul
                ref={rowRef}
                className="carousel-list"
                onScroll={updateScroll}
            >
                {children}
            </ul>
        </div>
    )

}
