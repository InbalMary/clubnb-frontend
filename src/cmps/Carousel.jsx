import { useState, useEffect, useRef } from 'react'

export function Carousel({ children, renderControls }) {
    const rowRef = useRef(null) //  Make a ref that will hold a single <ul> element, a row
    const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false })// tracking which row can scroll left/right

    const CARD_PER_SCROLL = 2

    function updateScroll() {
        const rowEl = rowRef.current
        if (!rowEl) return

        const atStart = rowEl.scrollLeft <= 0
        const atEnd = rowEl.scrollLeft + rowEl.clientWidth >= rowEl.scrollWidth - 2
        //rowEl.clientWidth: visible width of the row.
        //rowEl.scrollWidth: full width of all children combined. -2 to avoid rounding errors
        //scrollLeft = built-in. how many pixels the content is scrolled from its left edge (0 = fully left, increases as you scroll right)
        setScrollState({ atStart, atEnd })
        // console.log('Updated scrollState:', { atStart, atEnd })
    }

    //Function to scroll left/right 
    function scrollRow(direction) {
        const rowEl = rowRef.current
        if (!rowEl) return
        const cards = Array.from(rowEl.children)
        // console.log('rowEl.children:', rowEl.children)
        // console.log('cards:', cards)

        const scrollLeft = rowEl.scrollLeft //scrollLeft number of pixels scrolled horizontally

        let currIndex = cards.findIndex(
            card => card.offsetLeft >= scrollLeft - 2 //card.offsetLeft => where the card starts relative to the container. 
            //Find the first card whose left edge is at or just past the current scroll position.
            //res: index of the first visible card in the viewport.
        )
        let nextIndex = currIndex + (direction * CARD_PER_SCROLL)
        if (nextIndex < 0) nextIndex = 0
        if (nextIndex >= cards.length) nextIndex = cards.length - 1

        const targetCard = cards[nextIndex]
        rowEl.scrollTo({  // scrollTo is built-in method for scrolling an element to a specific position. either scrollTo(x, y) or options object
            left: targetCard.offsetLeft,  //left = built in key: pixels. top - vertical scroll is another built-in possible key
            behavior: "smooth"   //behavior = built-in key options: "instant" | "smooth" | "auto".
        })
        updateScroll()
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
