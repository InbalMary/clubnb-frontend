import { useState } from "react";

export const useDateRange = () => {
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

    return {
        dateRange,
        setDateRange
    }
}
