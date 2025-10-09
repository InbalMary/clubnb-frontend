import { useDispatch, useSelector } from 'react-redux'
import { setFilterBy } from '../store/actions/stay.actions';
import { useEffect, useState } from 'react'
import { formatDate } from '../services/util.service';
import { SET_FILTERBY } from '../store/reducers/stay.reducer';


export const useDateRange = () => {
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

    return {
        dateRange,
        setDateRange
    }
}

// === Global custom hook that render the filter as well, across the whole app ====

export function reUseDateRange() {
    const filterBy = useSelector(state => state.stayModule.filterBy)
    const dispatch = useDispatch()

    function getCmdSetFilterBy(filterBy) {
        return {
            type: SET_FILTERBY,
            filterBy,
        }
    }
    const [range, setRange] = useState({
        from: filterBy.startDate ? new Date(filterBy.startDate) : null,
        to: filterBy.endDate ? new Date(filterBy.endDate) : null
    })

    useEffect(() => {
        if (range.from && range.to) {
            dispatch(getCmdSetFilterBy({
                ...filterBy,
                startDate: formatDate(range.from),
                endDate: formatDate(range.to)
            }))
        }

    }, [range])

    return {
        dateRange: range,
        setDateRange: setRange
    }
}
