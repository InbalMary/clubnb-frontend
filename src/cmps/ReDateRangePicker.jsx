import { formatDate } from '../services/util.service'
import { DayPicker } from "react-day-picker"
import { enUS } from 'date-fns/locale'
import { useEffect, useState } from "react"
import { useSearchParams } from 'react-router'

export function ReDateRangePicker({ value, onChange, onComplete }) {
    const [range, setRange] = useState(value || { from: undefined, to: undefined })

    const [searchParams, setSearchParams] = useSearchParams()
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    useEffect(() => {
        if (startDate || endDate) {
            setRange({
                from: startDate ? new Date(startDate.replace(/\//g, '-')) : null,
                to: endDate ? new Date(endDate.replace(/\//g, '-')) : null
            })
        }
    }, [])

    useEffect(() => {

        const params = new URLSearchParams()

        if (range.from) {
            params.set('startDate', formatDate(range.from))
        }

        if (range.to) {
            params.set('endDate', formatDate(range.to))
        }
        setSearchParams(params, { replace: true })

    }, [range])

    function handleSelect(newRange) {
        setRange(newRange)
        onChange?.(newRange)

        if (newRange?.from && newRange?.to) {
            onComplete?.(newRange)
            onClose?.()
        }
    }

    const customLocale = {
        ...enUS,
        formatters: {
            ...enUS.formatters,
            // Override the weekday formatter
            weekday: (date, options) => {
                return date.toLocaleDateString('en-US', { weekday: 'narrow' }) // ➝ "M", "T", etc.
            }
        }
    }
    
    return (
        <div className="date-container">
            <DayPicker
                mode="range"
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                locale={customLocale} />
            {/* <button onClick={onClose} className="close-picker">Close</button> */}
        </div>
    )

}