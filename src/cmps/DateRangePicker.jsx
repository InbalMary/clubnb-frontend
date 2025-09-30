import { useState } from "react";
import { DayPicker } from "react-day-picker";

export function DateRangePicker({ onComplete, initialFocus = 'checkin', value }) {
    const [focusedInput, setFocusedInput] = useState(initialFocus)

    const handleDateSelect = (range) => {
        if (!range) return

        if (focusedInput === 'checkin') {
            onComplete?.({ from: range.from, to: value.to ?? undefined })
            setFocusedInput('checkout')
        } else if (focusedInput === 'checkout') {
            onComplete?.({ from: value.from, to: range.to ?? range.from })
        }
    }
    const modifiers = {
        checkin: value.from,
        checkout: value.to,
        range: { from: value.from, to: value.to }
    }

    const modifiersClassNames = {
        checkin: 'rdp-day_checkin',
        checkout: 'rdp-day_checkout',
        range: 'rdp-day_range',
        today: 'rdp-day_today',
    }

    return (
        <div className="date-modal-content">
            <DayPicker
                mode="range"
                selected={value}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
            />
        </div>
    )
}