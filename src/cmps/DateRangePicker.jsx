import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { enUS } from 'date-fns/locale'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export function DateRangePicker({ onComplete, value, activeField }) {
    const handleDateSelect = (range) => {
        if (!range) return

        if (activeField === 'checkin') {
            onComplete?.({ from: range.from, to: value.to ?? null })
        } else if (activeField === 'checkout') {
            onComplete?.({ from: value.from, to: range.to ?? range.from })
        } else {
            // Fallback when no field is active (for use in details page)
            const from = range.from ?? range.to
            const to = range.to ?? range.from
            onComplete?.({ from, to })
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
            <SimpleBar style={{ maxHeight: "calc(100vh - 200px)", overflowX: "hidden" }}>
                <DayPicker
                    mode="range"
                    selected={value.from && value.to ? value : undefined}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    locale={enUS}
                    formatters={{
                        formatWeekdayName: (day) =>
                            day.toLocaleDateString("en-US", { weekday: "narrow" }) // ➝ M, T, W...
                    }}
                />
            </SimpleBar>
        </div>
    )
}