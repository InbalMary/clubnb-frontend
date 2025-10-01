import { useState, useEffect, useRef } from 'react'

import { userService } from '../services/user'
import { StayPreview } from './stayPreview'

import rightPointer from '../assets/svgs/right-pointer.svg'
import arrowRight from '../assets/svgs/right-carousel.svg'
import arrowLeft from '../assets/svgs/left-carousel.svg'

export function StayList({ stays }) {
    const rowRefs = useRef([]) // Make a ref that will hold an array of row <ul> elements
    const [scrollState, setScrollState] = useState([])// [{ scrollStart, scrollEnd }, ...]tracking which row can scroll left/right
    const demoTitles = ['Featured Stays', 'Top Rated', 'Beachfront', 'City Escapes', 'Nature Retreats']

    function updateScroll(idx) {
        const rowEl = rowRefs.current[idx]
        if (!rowEl) return

        const isScrollStart = rowEl.scrollLeft <= 0
        const isScrollEnd = rowEl.scrollLeft + rowEl.clientWidth >= rowEl.scrollWidth
        //clientWidth = the visible width of the element, the window. built-in
        //scrollWidth = the total width of the scrollable content, all the cards. built-in
        setScrollState(prev => {
            const rowsCopy = [...prev] // copy old rows array
            rowsCopy[idx] = { start: isScrollStart, end: isScrollEnd }
            return rowsCopy //replace with updated copy
        })
    }

    //Function to scroll one row left/right
    function scrollRow(rowEl, direction) {
        if (rowEl) {
            rowEl.scrollLeft += direction * 250 // move by one card width? scrollLeft a built-in property
        }
    }

    return (
        <section className='stay-list-section'>
            {demoTitles.map((title, idx) => { //how many rows and which header each row gets
                const rowStays = stays.slice(idx * 7, idx * 7 + 7)
                if (!rowStays.length) return null


                return (
                    <div className='stay-row' key={title}>
                        <div className='stay-row-header'>
                            <h3 className="stay-list-title">{title}
                                <img src={rightPointer} className='right-pointer' />
                            </h3>
                            <div className='carousel-controls'>
                                <button onClick={() => scrollRow(rowRefs.current[idx], -1)}>

                                    <img src={arrowLeft} alt="Scroll left" className='carousel-icon' />
                                </button>
                                <button onClick={() => scrollRow(rowRefs.current[idx], 1)}>
                                    <img src={arrowRight} alt="Scroll right" className='carousel-icon' />
                                </button>
                            </div>
                        </div>
                        <ul
                            ref={el => (rowRefs.current[idx] = el)} //el is the DOM element <ul> React gives during rendering.
                            className="stay-list"
                        >
                            {rowStays.map(stay => // what cards go inside the row
                                <li key={stay._id}>
                                    <StayPreview stay={stay} />
                                </li>)
                            }
                        </ul>
                    </div>
                )
            })}

        </section>
    )
}

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px"}}>

</svg> */}
