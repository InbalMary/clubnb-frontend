import { useEffect } from "react"

export function useClickOutside(refs, handler) {
    useEffect(() => {
        function handleClickOutside(event) {
            const clickedInside = refs.some(ref =>
                ref.current && ref.current.contains(event.target)
            )

            if (!clickedInside) {
                handler(event)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [refs, handler])
}