import { useState } from "react";
import { DayPicker } from "react-day-picker";

export function DateRangePicker({ onComplete, initialFocus = 'checkin' }) {
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })
    const [focusedInput, setFocusedInput] = useState(initialFocus)

    const handleDateSelect = (range) => {
        if (!range) {
            setDateRange({ from: undefined, to: undefined })
            setFocusedInput('checkin')
            return
        }

        if (focusedInput === 'checkin') {
            setDateRange({ from: range.from, to: undefined })
            setFocusedInput('checkout')
        }
        else if (focusedInput === 'checkout' && range.from && range.to) {
            setDateRange(range)
            setTimeout(() => {
                onComplete?.(range)
            }, 200)
        }
    }

    return (
        <div className="date-modal-content">
            <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                modifiersClassNames={{
                    selected: 'rdp-day_selected',
                    today: 'rdp-day_today',
                }}
            />
        </div>
    )
}