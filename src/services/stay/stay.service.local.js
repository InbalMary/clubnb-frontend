
import { storageService } from '../async-storage.service'
import { formatName, makeId } from '../util.service'
import { userService } from '../user'
import { demoStays } from '../../data/demo-stays'

const STORAGE_KEY = 'stay'

if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStays))
}

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayReview
}
window.cs = stayService


async function query(filterBy = { txt: '', minPrice: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    // console.log('Stays found in storage:', stays)

    const { txt, minPrice, sortField, sortDir, destination, startDate, endDate, guests, type, city } = filterBy

    if (city) {
        stays = stays.filter(stay =>
            stay.loc?.city?.toLowerCase().includes(city.toLowerCase())
        )
    }

    if (type) {
        stays = stays.filter(stay => stay.type === type)
    }

    if (destination) {
        const regex = new RegExp(destination, 'i')
        stays = stays.filter(stay =>
            regex.test(stay.name) ||
            regex.test(stay.summary) ||
            regex.test(stay.loc?.address) ||
            regex.test(stay.loc?.city) ||
            regex.test(stay.loc?.country) ||
            regex.test(`${stay.loc?.city}, ${stay.loc?.country}`)
        )
    }

    if (startDate && endDate) {
        const filterStart = new Date(startDate.replace(/\//g, '-'))
        const filterEnd = new Date(endDate.replace(/\//g, '-'))

        stays = stays.filter(stay => {
            if (!stay.startDate || !stay.endDate) return true

            const stayStart = new Date(stay.startDate)
            const stayEnd = new Date(stay.endDate)

            return filterStart >= stayStart && filterEnd <= stayEnd
        })
    }

    if (guests) {
        const totalGuests = (guests.adults || 0) + (guests.children || 0)
        // Note: infants and pets don't count for now
        if (totalGuests > 0) {
            stays = stays.filter(stay => stay.capacity >= totalGuests)
        }
    }

    if (txt) {
        const regex = new RegExp(txt, 'i')
        stays = stays.filter(stay =>
            regex.test(stay.name) ||
            regex.test(stay.summary) ||
            regex.test(stay.loc?.address) ||
            regex.test(stay.loc?.city) ||
            regex.test(stay.loc?.country)
        )
    }

    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }

    if (sortField === 'name') {
        stays.sort((stay1, stay2) =>
            stay1.name.localeCompare(stay2.name) * +sortDir)
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1.price - stay2.price) * +sortDir)
    }

    stays = stays.map(stay => ({
        _id: stay._id,
        name: stay.name,
        type: stay.type,
        imgUrls: stay.imgUrls,
        price: stay.price,
        summary: stay.summary,
        capacity: stay.capacity,
        bathrooms: stay.bathrooms,
        bedrooms: stay.bedrooms,
        roomType: stay.roomType,
        startDate: stay.startDate,
        endDate: stay.endDate,
        host: stay.host,
        loc: stay.loc,
        reviews: stay.reviews,
        likedByUsers: stay.likedByUsers,

        // add rating for demo/testing between 4.4–5.0
        rating: (Math.random() * 0.6 + 4.4).toFixed(2)
    }))

    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    if (stay._id) {
        return storageService.put(STORAGE_KEY, stay)
    } else {
        const stayToSave = {
            ...stay,
            // Later, owner is set by the backend
            host: stay.host && stay.host._id ? stay.host : userService.getLoggedinUser(),
            reviews: stay.reviews || [],
            likedByUsers: stay.likedByUsers || []
        }
        return storageService.post(STORAGE_KEY, stayToSave)
    }
}

async function addStayReview(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const review = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.reviews.push(review)
    await storageService.put(STORAGE_KEY, stay)

    return review
}


export function getAmenitiesData(amenitiesSvgs, stayAmenities = []) {

    const amenitiesArr = []

    stayAmenities?.forEach((amenityKey) => {
        const [category, name] = amenityKey.split('.')
        const formatedName = formatName(name)
        const formatedCat = formatName(category)
        if (amenitiesSvgs?.[category]?.[name]) {
            amenitiesArr.push({
                type: formatedCat,
                name: formatedName,
                svgUrl: amenitiesSvgs[category][name]
            })
        }
    })
    return amenitiesArr
}