import { useEffect } from "react"

export function useKeyListener(key, handler) {
    useEffect(() => {
        function handleKeyDown(event) {
            if (key === event.key) {
                handler(event)

            }
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }

    }, [key])
}