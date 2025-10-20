const demoUser = { _id: 'u101', fullname: 'Alice Chang' }

export const demoWishlists = [
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
                imgUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-49049088/original/c23d61d5-68a0-4bec-99d7-fc48eb7776fc.jpeg?im_w=720',
            },
            {
                _id: 's102',
                name: 'Old Town Apartment',
                imgUrl: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTExMTQ5MDQ1MzYwMTAzNTEyOA%3D%3D/original/6c00e948-452f-4d34-8e1f-118c0c9e7871.jpeg?im_w=720',
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
                imgUrl: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1070270537377163305/original/03754647-aec4-4a24-898e-05f7fc01a9d5.png?im_w=720',

            },
            {
                _id: 's104',
                name: 'Central Park View',
                imgUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-8152916/original/8109a5bc-665a-4d06-a40f-1c6c020bc17e.jpeg?im_w=720',
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },
    {
        _id: 'wl103',
        title: 'Te Aviv',
        byUser: demoUser,
        city: 'Tel Aviv',
        country: 'Israel',
        stays: [
            {
                _id: 's105',
                name: 'Rooftop apartment',
                imgUrl: 'https://a0.muscache.com/im/pictures/24671905/661b6f78_original.jpg?im_w=720',

            },
            {
                _id: 's106',
                name: 'Bauhaus apartment',
                imgUrl: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1494196231683419865/original/f1b8d595-5d15-490d-b41d-2b2fd027d973.jpeg?im_w=720',
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
                imgUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-8152916/original/8109a5bc-665a-4d06-a40f-1c6c020bc17e.jpeg?im_w=720',

            },
            {
                _id: 's108',
                name: 'Rooftop Paris apartment',
                imgUrl: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1477518867707399158/original/675952f5-76eb-4d4c-91f5-e05634c2771a.png?im_w=720',
            },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
    },

]

