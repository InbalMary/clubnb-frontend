import { calculateNights, formatDate } from '../services/util.service'
import { DayPicker } from "react-day-picker"
import { enUS } from 'date-fns/locale'
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from 'react-router'

export function ReDateRangePicker({ value, onComplete, activeField }) {
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
        // onChange?.(newRange)

        setRange(newRange)

        if (newRange?.from && newRange?.to) {
            onComplete?.(newRange)
            // onClose?.()
        }
        if (activeField) {
            if (activeField === 'checkin') {
                onComplete?.({ from: newRange.from, to: value.to ?? null })
            } else if (activeField === 'checkout') {
                onComplete?.({ from: value.from, to: newRange.to ?? newRange.from })
            }
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
        </div>
    )
}
