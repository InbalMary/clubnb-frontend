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

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
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
    return diffInMs / (1000 * 60 * 60 * 24) // res: number of nights
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
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
        .replace(/([A-Z])/, (match) => match.toLowerCase()) // Lowercase all the uppercase letters
        .replace(/(^.)/, (match) => match.toUpperCase()) // Capitalize the first letter
}

export function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}


function formatGuestsText(guests) {
    const counts = [
        { count: guests.adults + guests.children, label: 'guest' },
        { count: guests.infants, label: 'infant' },
        { count: guests.pets, label: 'pet' },
    ]

    const parts = counts
        .filter(({ count }) => count > 0)
        .map(({ count, label }) => `${count} ${label}${count > 1 ? 's' : ''}`)

    return parts.length ? parts.join(', ') : 'Add guests'
}