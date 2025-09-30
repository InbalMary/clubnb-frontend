import { useState } from "react";
import { DayPicker } from "react-day-picker";

export function DateRangePicker({ onComplete, initialFocus = 'checkin', value }) {
    const [focusedInput, setFocusedInput] = useState(initialFocus)

    const handleDateSelect = (range) => {
        if (!range) {
            setFocusedInput('checkin')
            return
        }

        if (focusedInput === 'checkin') {
            onComplete?.({ from: range.from, to: undefined })
            setFocusedInput('checkout')
        } else if (focusedInput === 'checkout' && range.from && range.to) {
            onComplete?.(range)
        }
    }

    return (
        <div className="date-modal-content">
            <DayPicker
                mode="range"
                selected={value}
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