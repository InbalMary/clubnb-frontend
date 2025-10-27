import { demoStays } from "./demo-stays"

const demoUser = { _id: 'u101', fullname: 'Alice Chang' }

const baseWishlists = [
    {
        _id: 'wl101',
        title: 'Barcelona Summer',
        byUser: demoUser,
        city: 'Barcelona',
        country: 'Spain',
        stays: [
            {
                _id: 's101',
                name: 'Beach House',
                rating: 4.85,
                beds: 2,
                summary: 'Cozy studio in the heart of the city, steps from cafes and nightlife.',
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-49049088/original/c23d61d5-68a0-4bec-99d7-fc48eb7776fc.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM1NTkwNDYzODYwODc3OTQ4MA==/original/94e0da76-5aa6-44fb-a61d-368f5eeaac5a.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/54229873-ae41-44a1-9f22-28f40e951d5a.jpg?im_w=720",
                    "https://a0.muscache.com/im/pictures/72140cb9-a92a-40b5-b27e-c0d9809cd397.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/eca86db9-89c5-4d76-8c8d-08054cb7e07e.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/28ec2182-cff2-41cd-8e11-c5f8c4148f23.jpg?im_w=480",
                ],
                loc: {
                    lat: 41.3851,
                    lng: 2.1734
                }
            },
            {
                _id: 's102',
                name: 'Old Town Apartment',
                rating: 4.7,
                beds: 2,
                summary: 'Bright seaside apartment with panoramic ocean views and private balcony.',
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTExMTQ5MDQ1MzYwMTAzNTEyOA%3D%3D/original/6c00e948-452f-4d34-8e1f-118c0c9e7871.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/66e9db77-32f4-4d18-ba0c-5784895be9f9.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/47aadc2c-61c0-4177-b288-d23f6bd94796.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/ad9482c6-1783-472d-a938-3d65fa0ae2a7.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/6f0b194c-cb3a-4e83-915d-64f400a813a7.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/064da6c4-751f-4df9-85a0-982673023318.jpeg?im_w=960",
                ],
                loc: {
                    lat: 41.3832,
                    lng: 2.1824
                }
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 1 month ago
    },
    {
        _id: 'wl102',
        title: 'New York Dreams',
        byUser: demoUser,
        city: 'New York',
        country: 'USA',
        stays: [
            {
                _id: 's103',
                name: 'City Loft',
                rating: 4.7,
                beds: 2,
                summary: "Midtown velvet escape",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1070270537377163305/original/03754647-aec4-4a24-898e-05f7fc01a9d5.png?im_w=720',
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/5e6f9163-ea59-4a3e-9a31-a13711f37c78.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/51098cf1-4475-42fd-b0ec-c5904912ee82.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/722f655a-f087-45a5-836d-cd9aa696db39.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/bb36d46a-cc9d-4a75-b029-a1c18bf185d8.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/7f54a878-79ef-4d9c-8411-6c3a608f3ebb.jpeg?im_w=960",
                ],
                loc: {
                    lat: 40.759,
                    lng: -73.985
                }
            },
            {
                _id: 's104',
                name: 'Central Park View',
                rating: 4.65,
                beds: 3,
                summary: "Modern loft with exposed brick and skyline views, perfect for couples",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-8152916/original/8109a5bc-665a-4d06-a40f-1c6c020bc17e.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/5d03cd91-6312-453d-a753-c908a873408a.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/b80e5fde-3b6b-4721-87f2-c1d64f9c827e.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/miso/Hosting-691676460109271194/original/583db50d-b4e7-413c-b87a-8343cf3e884e.png?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/6fb6e350-e9d2-4735-9aeb-df74a4d3de70.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/af2d2de9-bcb4-4a8d-ad57-9562def3c563.jpeg?im_w=960",
                ],
                loc: {
                    lat: 40.7742,
                    lng: -73.9654
                }
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },
    {
        _id: 'wl103',
        title: 'Tel Aviv',
        byUser: demoUser,
        city: 'Tel Aviv',
        country: 'Israel',
        stays: [
            {
                _id: 's105',
                name: 'Rooftop apartment',
                rating: 4.88,
                beds: 2,
                summary: "Charming countryside cottage with a garden and outdoor dining area.",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/24671905/661b6f78_original.jpg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/aa461d83-46f2-4c22-b5f7-39fa5f3febac.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/350b471b-f37d-4d73-9e5b-a6dd281e8b80.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/ce0cd732-8a90-42ac-87ea-3d4fe2b9f2f4.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/2c1460c6-6655-44ae-8748-f004117ea1a3.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/d622991c-1344-4dbe-90df-6317bafc52aa.jpeg?im_w=960",
                ],
                loc: {
                    lat: 32.065,
                    lng: 34.777
                }
            },
            {
                _id: 's106',
                name: 'Bauhaus apartment',
                rating: 4.75,
                beds: 3,
                summary: "Luxury villa with infinity pool and spacious terrace overlooking the bay",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1494196231683419865/original/f1b8d595-5d15-490d-b41d-2b2fd027d973.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/4279ec7c-7394-4572-a8bb-1445e079fe58.jpeg?im_w=960",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/578a39ea-267c-4f72-82ec-5e80156e7ee5.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/46042ac1-1c91-425a-a49e-8f6dce1d1589.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/3401d91f-551d-4891-a7a6-5d0ae0f3917f.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/f4c96348-cf44-4492-a817-abb442775e7a.jpeg?im_w=480",
                ],
                loc: {
                    lat: 32.0853,
                    lng: 34.7818
                }
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },
    {
        _id: 'wl104',
        title: 'Paris',
        byUser: demoUser,
        city: 'Paris',
        country: 'France',
        stays: [
            {
                _id: 's107',
                name: 'Classic Parisian apartment',
                rating: 4.5,
                beds: 1,
                summary: "Minimalist downtown apartment, walking distance to all major attractions.",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-8152916/original/8109a5bc-665a-4d06-a40f-1c6c020bc17e.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/136fdbc5-a6f9-494f-a716-bb0bf4f85b99.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/da8cdbec-1961-4beb-9faa-860d46182918.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/4d4b68ef-eb39-4363-a1d1-21b8f7d8c4bc.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/e7fcb3cf-ea93-4414-8a6f-baba9fed8c68.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/40eebbf6-592f-437b-957e-07424921e323.jpeg?im_w=960",
                ],
                loc: {
                    lat: 48.8619,
                    lng: 2.3361
                }
            },
            {
                _id: 's108',
                name: 'Rooftop Paris apartment',
                rating: 4.2,
                beds: 1,
                summary: "Elegant suite in a historic building, blending old charm with modern comfort",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1477518867707399158/original/675952f5-76eb-4d4c-91f5-e05634c2771a.png?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/a2c850cf-9502-4ca9-ba3e-98e3c3bac24c.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/23497bce-770e-4792-bf51-e0e30d0d459d.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/832a3ec0-e5a2-4bdd-a363-b31d71268e7e.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/267eeaf6-9627-4c06-8882-23abcb0dc848.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/2095d94f-adcd-4b2d-a696-be7ff10a6b66.jpeg?im_w=960",
                ],
                loc: {
                    lat: 48.8738,
                    lng: 2.3321
                }
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },
    {
        _id: 'wl105',
        title: 'Bali Bungalow',
        byUser: demoUser,
        city: 'Bali',
        country: 'Indonesia',
        stays: [
            {
                _id: 's109',
                name: 'Rustic Bungalow',
                rating: 4.3,
                beds: 1,
                summary: "Beachfront bungalow with hammock, barbecue, and direct sand access.",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-52676634/original/c6447fe3-1ea3-40c4-a347-56a5d79b7e18.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/fd0a9286-082a-4805-b73c-2d7096ae1438.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/e15439c8-9f25-4fcb-91d7-7c9275004758.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/8b33b148-508b-48b7-9317-d6b8fae9e8cd.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/44ff42c0-df3e-4852-a1b5-751b65487a50.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/miso/Hosting-1430798282653568595/original/2178b294-3421-40e1-ab26-7ff5f532beb5.jpeg?im_w=960",
                ],
                loc: {
                    lat: -8.648,
                    lng: 115.131
                }
            },
            {
                _id: 's110',
                name: 'Bungalow with balcony',
                rating: 4.8,
                beds: 1,
                summary: "Tropical-style bungalow surrounded by palms, with an open deck and cozy hammock — perfect for lazy beach mornings.",
                imgUrls: [
                    'https://a0.muscache.com/im/pictures/miso/Hosting-1019120441924581642/original/cf33de17-4728-4eff-86d2-a6d292fb74ba.jpeg?im_w=720',
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NDY5NTk4Ng%3D%3D/original/677c3190-37d6-4030-abc6-d151a16d2536.jpeg?im_w=960",
                    "https://a0.muscache.com/im/pictures/66834258/7b4df7a2_original.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NDY5NTk4Ng%3D%3D/original/f8674240-b93d-4910-9f5e-e47e31617797.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/355e3a88-1445-40ef-a137-9493975e9d74.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/ccffb1af-e48f-402c-a2f8-4f452bd086c9.jpg?im_w=480",
                ],
                loc: {
                    lat: -8.792,
                    lng: 115.168
                }
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },

]

export const demoWishlists = baseWishlists.map(wl => ({
    ...wl,
    stays: wl.stays.map(minStay => {
        const fullStay = demoStays.find(s => s._id === minStay._id)
        return { ...fullStay, ...minStay } // full fields + any overrides
    })
}))

