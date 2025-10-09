import { createContext, useContext } from 'react'
import { reUseDateRange } from '../customHooks/useDateRange'

const DateRangeContext = createContext()

export function DateRangeProvider({ children }) {

    const { dateRange, setDateRange } = reUseDateRange()

    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    )
}

export function useDateContext() {
    const context = useContext(DateRangeContext)
    if (!context) {
        throw new Error('useDateRange must be used within a DateRangeProvider')
    }
    return context
}