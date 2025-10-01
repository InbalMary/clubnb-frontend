import { useState } from "react";
import { DayPicker } from "react-day-picker";

export function DateRangePicker({ onComplete, value, activeField }) {
    const handleDateSelect = (range) => {
        if (!range) return

        if (activeField === 'checkin') {
            onComplete?.({ from: range.from, to: value.to ?? null })
        } else if (activeField === 'checkout') {
            onComplete?.({ from: value.from, to: range.to ?? range.from })
        }
    }   
    const modifiers = {
        checkin: value.from,
        checkout: value.to,
        range: value.from && value.to ? { from: value.from, to: value.to } : undefined
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
                selected={value.from && value.to ? value : undefined}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
            />
        </div>
    )
}