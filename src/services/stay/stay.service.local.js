
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'
import { demoStays } from '../../data/demo-stays'

const STORAGE_KEY = 'stay'

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

    if (!stays || !stays.lenght) {
        console.log('No stays found, getting demo data...')
        stays = demoStays
        stays.forEach(stay => storageService.post(STORAGE_KEY, stay))
    }

    const { txt, minPrice, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.description))
    }
    if (minPrice) {
        stays = stays.filter(stay => stay.price >= minPrice)
    }
    if (sortField === 'name') {
        stays.sort((stay1, stay2) =>
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    stays = stays.map(({ _id, name, price, owner, startDate, endDate, imgUrl }) => ({ _id, name, price, owner, startDate, endDate, imgUrl }))
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
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            price: stay.price
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            reviews: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
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
