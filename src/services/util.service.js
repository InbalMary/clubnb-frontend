export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

// export function debounce(func, timeout = 300) {
//     let timer
//     return (...args) => {
//         clearTimeout(timer)
//         timer = setTimeout(() => { func.apply(this, args) }, timeout)
//     }
// }

export function debounce(func, timeout = 300) {
    let timer

    function debounced(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }

    debounced.cancel = () => {
        clearTimeout(timer)
        timer = null
    };

    return debounced
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function formatStayDates(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const options = { month: 'short', day: 'numeric' } //Oct 10

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' }) // Oct
    //if dates are within the same month
    if (start.getMonth() === end.getMonth()) {
        return `${startMonth} ${start.getDate()}-${end.getDate()}` //Oct 10-15
    }
    //if dates are across months
    return `${start.toLocaleDateString('en-US', options)}-${end.toLocaleDateString('en-US', options)}` // Sep 30 - Oct 2
}

export function calculateNights(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffInMs = end - start
    //convert Ms to days
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) // res: number of nights
}

export function getRandomItems(array, length) {
    const result = [];
    const availableItems = [...array]; // Copy array to avoid mutating original

    for (let i = 0; i < length; i++) {
        if (availableItems.length === 0) break; // Break if we run out of items
        const idx = getRandomIntInclusive(0, availableItems.length - 1);
        result.push(availableItems.splice(idx, 1)[0]) // Remove the item from the availableItems
    }

    return result
}

export function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function formatName(str) {
    if (!str) return ''
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
        .replace(/([A-Z])/, (match) => match.toLowerCase()) // Lowercase all the uppercase letters
        .replace(/(^.)/, (match) => match.toUpperCase()) // Capitalize the first letter
}

export function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getTruthyValues(obj) {
    const newObj = {}
    for (const key in obj) {
        const value = obj[key]
        if (value) {
            newObj[key] = value
        }
    }
    return newObj
}

export function toUrlDate(date) {
    if (!date) return ''
    const d = (date instanceof Date) ? date : new Date(date)
    return d.toISOString().split('T')[0] // "YYYY-MM-DD"
}

export function getAvgRate(reviews) {
    let totalSum = 0
    let totalReviews = 0

    reviews.forEach((review) => {
        const rates = Object.values(review.rate).reduce((sum, currentValue) => sum + currentValue, 0)

        const avgRateForReview = rates / Object.values(review.rate).length

        totalSum += avgRateForReview
        totalReviews += 1
    })
    const avgRate = totalSum / totalReviews
    const roundedAverage = avgRate.toFixed(2)
    if (isNaN(roundedAverage)) return 0
    return roundedAverage
}

export function formatGuestsText(guests) {
    const counts = [
        { count: guests?.adults + guests?.children, label: 'guest' },
        { count: guests?.infants, label: 'infant' },
        { count: guests?.pets, label: 'pet' },
    ]

    const parts = counts
        .filter(({ count }) => count > 0)
        .map(({ count, label }) => `${count} ${label}${count > 1 ? 's' : ''}`)

    return parts.length ? parts.join(', ') : 'Add guests'
}

export const formatDateWithFullYear = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatDateRange = (startDateString, endDateString) => {
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    const optionsMonth = { month: 'short' }
    const optionsDay = { day: 'numeric' }
    const optionsYear = { year: 'numeric' }
    const startMonth = startDate.toLocaleDateString('en-US', optionsMonth)
    const startDay = startDate.toLocaleDateString('en-US', optionsDay)
    const endMonth = endDate.toLocaleDateString('en-US', optionsMonth)
    const endDay = endDate.toLocaleDateString('en-US', optionsDay)
    const year = startDate.toLocaleDateString('en-US', optionsYear)

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}, ${year}`
    } else {
        return `${startMonth} ${startDay}-${endMonth} ${endDay}, ${year}`
    }
}

export function generateAvailability(minMonths = 1, maxMonths = 6) {
    const start = new Date()

    const randomStartDay = Math.floor(Math.random() * 10)
    start.setDate(start.getDate() + randomStartDay)

    const end = new Date(start)

    const randomMonths = Math.floor(Math.random() * (maxMonths - minMonths + 1)) + minMonths
    end.setMonth(end.getMonth() + randomMonths)

    const randomEndDay = Math.floor(Math.random() * 15) - 7
    end.setDate(end.getDate() + randomEndDay)
    return {
        availableFrom: formatDate(start),
        availableUntil: formatDate(end)
    }
}

export function getSuggestedStayRange(stay, nights = 5) {
    if (!stay.availableFrom || !stay.availableUntil) return null

    const from = new Date(stay.availableFrom)
    const until = new Date(stay.availableUntil)

    const totalDays = Math.floor((until - from) / (1000 * 60 * 60 * 24))
    if (totalDays <= nights) {
        return {
            start: from.toISOString().split('T')[0],
            end: until.toISOString().split('T')[0]
        }
    }
    const offset = Math.floor(totalDays / 3)
    const start = new Date(from)
    start.setDate(start.getDate() + offset)
    const end = new Date(start)
    end.setDate(start.getDate() + nights)

    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    }
}

export function getDateBefore(startDateStr, daysBefore = 7) {
    if (!startDateStr) return ''
    const startDate = new Date(startDateStr)
    startDate.setDate(startDate.getDate() - daysBefore)

    return startDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}