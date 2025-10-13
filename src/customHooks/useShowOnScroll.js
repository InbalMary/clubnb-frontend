import { useEffect, useState } from "react";

export function useSHowOnScroll(threshold = 630) {

    const [show, setShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset
            setShow(scrollY > threshold)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)

    }, [threshold])

    return show
}