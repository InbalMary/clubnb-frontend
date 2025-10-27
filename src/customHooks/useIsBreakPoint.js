import { useEffect, useState } from 'react'

export function useIsBreakPoint(breakpoint = 745) {
    // safe initial value (handles SSR)
    const getMatches = () => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false
        return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
    }

    const [isBreakPoint, setIsBreakPoint] = useState(getMatches)

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return

        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

        const handler = (e) => setIsBreakPoint(e.matches)
        // modern browsers support addEventListener, but fallback to addListener for older ones
        if (mq.addEventListener) mq.addEventListener('change', handler)
        else mq.addListener(handler)

        // ensure correct value on mount
        setIsBreakPoint(mq.matches)

        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', handler)
            else mq.removeListener(handler)
        }
    }, [breakpoint])

    return isBreakPoint
}