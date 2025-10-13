import { useEffect } from 'react'

export function useEscapeKey(handler) {
    useEffect(() => {
        function handleEscKey(event) {
            if (event.key === 'Escape') {
                handler(event)
            }
        }

        document.addEventListener("keydown", handleEscKey)
        return () => {
            document.removeEventListener("keydown", handleEscKey)
        }
    }, [handler])
}