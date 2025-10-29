// import { demoStays } from "./demo-stays"

const demoUser = { _id: 'u101', fullname: 'Alice Chang' }

export const demoWishlists = [
    //WL1
    {
        "_id": "wl101",
        "title": "Barcelona Summer",
        "byUser": {
            "_id": "u101",
            "fullname": "Alice Chang"
        },
        "createdAt": 1730135748321,
        "city": "Barcelona",
        "country": "Spain",
        "stays": [
            {
                "_id": "s101",
                "name": "Beach House",
                "type": "Beach stays",
                "price": 210,
                "cleaningFee": 40,
                "summary": "Cozy studio in the heart of Barcelona, steps from cafés, tapas bars, and the sandy beach. Featuring tall windows, airy décor, and a small balcony with city views, it offers the ideal mix of comfort and charm. Perfect for travelers wanting easy access to both nightlife and seaside relaxation.",
                "beds": 2,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 2,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.coffeeMaker",
                    "kitchen.microwave",
                    "bedroom.doubleBed",
                    "bathroom.hotWater",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Close to the Beach",
                        "sub": "Just a short walk from Barcelona’s sandy coastline.",
                        "imgUrl": "location.beach"
                    },
                    {
                        "main": "Perfect Location",
                        "sub": "Right next to local restaurants and cafés.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Cozy Interiors",
                        "sub": "Warm lighting and modern furniture for a relaxed stay.",
                        "imgUrl": "features.breakfast"
                    }
                ],
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u501",
                    "firstName": "Maria",
                    "fullname": "Maria López",
                    "location": "Barcelona, Spain",
                    "pictureUrl": "https://randomuser.me/api/portraits/women/65.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1628500000000,
                    "yearsHosting": 6,
                    "rating": 4.78,
                    "numReviews": 74,
                    "responseRate": 98,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born in Barcelona" },
                        { "icon": "work", "text": "Passionate about local culture and hosting" }
                    ],
                    "about": "I love welcoming guests from around the world and sharing my city’s culture."
                },
                "loc": {
                    "country": "Spain",
                    "countryCode": "ES",
                    "city": "Barcelona",
                    "address": "Carrer del Mar, Barcelona, Spain",
                    "lat": 41.3851,
                    "lng": 2.1734
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/miso/Hosting-49049088/original/c23d61d5-68a0-4bec-99d7-fc48eb7776fc.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM1NTkwNDYzODYwODc3OTQ4MA==/original/94e0da76-5aa6-44fb-a61d-368f5eeaac5a.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/54229873-ae41-44a1-9f22-28f40e951d5a.jpg?im_w=720",
                    "https://a0.muscache.com/im/pictures/72140cb9-a92a-40b5-b27e-c0d9809cd397.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/eca86db9-89c5-4d76-8c8d-08054cb7e07e.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/28ec2182-cff2-41cd-8e11-c5f8c4148f23.jpg?im_w=480"
                ],
                "reviews": [
                    {
                        "at": "2024-08-12T00:00:00.000Z",
                        "by": {
                            "_id": "u301",
                            "fullname": "Daniel",
                            "imgUrl": "https://randomuser.me/api/portraits/men/22.jpg"
                        },
                        "txt": "Amazing spot — walking distance to everything and super clean.",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 5.0,
                            "checkIn": 4.8,
                            "accuracy": 4.7,
                            "location": 5.0,
                            "value": 4.8
                        },
                        "nights": 4
                    },
                    {
                        "at": "2024-09-05T00:00:00.000Z",
                        "by": {
                            "_id": "u302",
                            "fullname": "Sophie",
                            "imgUrl": "https://randomuser.me/api/portraits/women/46.jpg"
                        },
                        "txt": "Loved the neighborhood and the beach proximity — would definitely come back!",
                        "rate": {
                            "cleanliness": 4.8,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 3
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-06-01",
                "availableUntil": "2025-06-05"
            },
            {
                "_id": "s102",
                "name": "Old Town Apartment",
                "type": "City stays",
                "price": 260,
                "cleaningFee": 45,
                "summary": "Bright seaside apartment nestled in Barcelona’s Old Town with panoramic ocean views and a private balcony. Spacious interiors, modern kitchen, and colorful local artwork create a warm Mediterranean feel. Minutes from the harbor, market streets, and lively tapas scene.",
                "beds": 2,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 3,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.fridge",
                    "kitchen.microwave",
                    "kitchen.coffeeMaker",
                    "bedroom.hangers",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.fireExtinguisher"
                ],
                "highlights": [
                    {
                        "main": "Ocean-View Balcony",
                        "sub": "Enjoy stunning Mediterranean sunsets from your own terrace.",
                        "imgUrl": "outdoor.privatePatio"
                    },
                    {
                        "main": "Historic Neighborhood",
                        "sub": "Located in the Gothic Quarter near lively plazas and markets.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Sunny Interiors",
                        "sub": "Large windows fill the space with natural light all day.",
                        "imgUrl": "features.breakfast"
                    }
                ]
                ,
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u502",
                    "firstName": "Carlos",
                    "fullname": "Carlos Martín",
                    "location": "Barcelona, Spain",
                    "pictureUrl": "https://randomuser.me/api/portraits/men/42.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "yearsHosting": 5,
                    "signupDate": 1644000000000,
                    "rating": 4.7,
                    "numReviews": 58,
                    "responseRate": 97,
                    "responseTime": "within a few hours",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born in Barcelona" },
                        { "icon": "languages", "text": "Speaks Spanish, Catalan, and English" }
                    ],
                    "about": "Architect and proud host. I love helping guests discover Barcelona’s architecture and food scene."
                },
                "loc": {
                    "country": "Spain",
                    "countryCode": "ES",
                    "city": "Barcelona",
                    "address": "Carrer de l’Argenteria 15, Barcelona, Spain",
                    "lat": 41.3832,
                    "lng": 2.1824
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTExMTQ5MDQ1MzYwMTAzNTEyOA%3D%3D/original/6c00e948-452f-4d34-8e1f-118c0c9e7871.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/66e9db77-32f4-4d18-ba0c-5784895be9f9.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/47aadc2c-61c0-4177-b288-d23f6bd94796.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/ad9482c6-1783-472d-a938-3d65fa0ae2a7.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/6f0b194c-cb3a-4e83-915d-64f400a813a7.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1394855747314311569/original/064da6c4-751f-4df9-85a0-982673023318.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-07-18T00:00:00.000Z",
                        "by": {
                            "_id": "u303",
                            "fullname": "Helena",
                            "imgUrl": "https://randomuser.me/api/portraits/women/33.jpg"
                        },
                        "txt": "Beautiful apartment with an incredible balcony view. Super clean and central.",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 4.8,
                            "checkIn": 4.9,
                            "accuracy": 4.7,
                            "location": 5.0,
                            "value": 4.6
                        },
                        "nights": 5
                    },
                    {
                        "at": "2024-08-02T00:00:00.000Z",
                        "by": {
                            "_id": "u304",
                            "fullname": "Luca",
                            "imgUrl": "https://randomuser.me/api/portraits/men/29.jpg"
                        },
                        "txt": "The view and location were unbeatable — loved the morning coffee on the balcony.",
                        "rate": {
                            "cleanliness": 4.8,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 4
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-07-10",
                "availableUntil": "2025-07-15"
            },
        ],

    }, //WL2
    {
        "_id": "wl102",
        "title": "New York Dreams",
        "byUser": {
            "_id": "u101",
            "fullname": "Alice Chang"
        },
        "createdAt": 1729572948321,
        "city": "New York",
        "country": "USA",
        "stays": [
            {
                "_id": "s103",
                "name": "City Loft",
                "type": "City stays",
                "price": 320,
                "cleaningFee": 60,
                "summary": "Midtown velvet escape — a stylish open-plan loft with high ceilings, exposed brick, and floor-to-ceiling windows that flood the space with light. Enjoy a quiet coffee corner, designer kitchen, and quick access to theaters, Central Park, and the best restaurants in the city.",
                "beds": 2,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 3,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.fridge",
                    "kitchen.oven",
                    "kitchen.coffeeMaker",
                    "bedroom.hangers",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Central Midtown Location",
                        "sub": "Walk to Times Square, Bryant Park, and major subway lines.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Luxury Interiors",
                        "sub": "Velvet furniture, modern lighting, and panoramic city windows.",
                        "imgUrl": "features.breakfast"
                    },
                    {
                        "main": "Quiet Retreat",
                        "sub": "Soundproof windows and plush bedding for peaceful nights.",
                        "imgUrl": "essentials.airCon"
                    }
                ]
                ,
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u503",
                    "firstName": "Jonathan",
                    "fullname": "Jonathan Reed",
                    "location": "New York, USA",
                    "pictureUrl": "https://randomuser.me/api/portraits/men/14.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1659500000000,
                    "yearsHosting": 3,
                    "rating": 4.7,
                    "numReviews": 63,
                    "responseRate": 99,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "work", "text": "Works in creative marketing and loves meeting travelers" },
                        { "icon": "languages", "text": "Speaks English and Spanish fluently" }
                    ],
                    "about": "Designer and lifelong New Yorker who loves sharing the best local coffee shops and art galleries."
                },
                "loc": {
                    "country": "USA",
                    "countryCode": "US",
                    "city": "New York",
                    "address": "West 47th Street, Midtown Manhattan, NY",
                    "lat": 40.759,
                    "lng": -73.985
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1070270537377163305/original/03754647-aec4-4a24-898e-05f7fc01a9d5.png?im_w=720",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/5e6f9163-ea59-4a3e-9a31-a13711f37c78.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/51098cf1-4475-42fd-b0ec-c5904912ee82.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/722f655a-f087-45a5-836d-cd9aa696db39.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/bb36d46a-cc9d-4a75-b029-a1c18bf185d8.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-1526155629581591675/original/7f54a878-79ef-4d9c-8411-6c3a608f3ebb.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-06-14T00:00:00.000Z",
                        "by": {
                            "_id": "u305",
                            "fullname": "Olivia",
                            "imgUrl": "https://randomuser.me/api/portraits/women/24.jpg"
                        },
                        "txt": "Beautiful loft — the decor and location made our stay unforgettable.",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 5.0,
                            "checkIn": 4.8,
                            "accuracy": 4.7,
                            "location": 5.0,
                            "value": 4.6
                        },
                        "nights": 3
                    },
                    {
                        "at": "2024-08-09T00:00:00.000Z",
                        "by": {
                            "_id": "u306",
                            "fullname": "Marcus",
                            "imgUrl": "https://randomuser.me/api/portraits/men/39.jpg"
                        },
                        "txt": "Exactly as described — modern, spotless, and super central.",
                        "rate": {
                            "cleanliness": 4.8,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.8
                        },
                        "nights": 4
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-09-10",
                "availableUntil": "2025-09-15"
            },
            {
                "_id": "s104",
                "name": "Central Park View",
                "type": "City stays",
                "price": 380,
                "cleaningFee": 65,
                "summary": "Modern loft with exposed brick and skyline views, perfect for couples or small families. The open kitchen and spacious living area overlook Central Park, offering a peaceful retreat within walking distance of galleries, cafés, and vibrant nightlife.",
                "bedrooms": 2,
                "bathrooms": 1,
                "guests": 4,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.fridge",
                    "kitchen.oven",
                    "kitchen.dishwasher",
                    "bedroom.hangers",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Central Park Views",
                        "sub": "Wake up to breathtaking views of the park and skyline.",
                        "imgUrl": "location.mountainView"
                    },
                    {
                        "main": "Historic Building",
                        "sub": "Beautifully preserved architecture with modern comforts.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Romantic Atmosphere",
                        "sub": "Exposed brick, soft lighting, and large windows create the perfect setting.",
                        "imgUrl": "features.breakfast"
                    }
                ],
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u504",
                    "firstName": "Ava",
                    "fullname": "Ava Thompson",
                    "location": "New York, USA",
                    "pictureUrl": "https://randomuser.me/api/portraits/women/58.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1675000000000,
                    "yearsHosting": 3,
                    "rating": 4.65,
                    "numReviews": 51,
                    "responseRate": 97,
                    "responseTime": "within a few hours",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born in Brooklyn" },
                        { "icon": "music", "text": "Plays saxophone in a local jazz band" }
                    ],
                    "about": "Born and raised in NYC. I love interior design, coffee, and sharing tips about hidden gems in the city."
                },
                "loc": {
                    "country": "USA",
                    "countryCode": "US",
                    "city": "New York",
                    "address": "5th Avenue & 72nd Street, Manhattan, NY",
                    "lat": 40.7742,
                    "lng": -73.9654
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/9f645432-c3ac-450c-b92b-eed83db704a6.jpg?im_w=960",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/5d03cd91-6312-453d-a753-c908a873408a.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/b80e5fde-3b6b-4721-87f2-c1d64f9c827e.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/miso/Hosting-691676460109271194/original/583db50d-b4e7-413c-b87a-8343cf3e884e.png?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/6fb6e350-e9d2-4735-9aeb-df74a4d3de70.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/prohost-api/Hosting-691676460109271194/original/af2d2de9-bcb4-4a8d-ad57-9562def3c563.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-05-22T00:00:00.000Z",
                        "by": {
                            "_id": "u307",
                            "fullname": "Clara",
                            "imgUrl": "https://randomuser.me/api/portraits/women/35.jpg"
                        },
                        "txt": "Unforgettable stay — the park view from the living room is just stunning!",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 5.0,
                            "checkIn": 4.9,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.6
                        },
                        "nights": 4
                    },
                    {
                        "at": "2024-07-03T00:00:00.000Z",
                        "by": {
                            "_id": "u308",
                            "fullname": "Michael",
                            "imgUrl": "https://randomuser.me/api/portraits/men/47.jpg"
                        },
                        "txt": "Perfect mix of comfort and charm — the location couldn’t be better.",
                        "rate": {
                            "cleanliness": 4.7,
                            "communication": 4.9,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 5
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-09-16",
                "availableUntil": "2025-09-20"
            },
        ],
    },
    //WL3
    {
        "_id": "wl103",
        "title": "Tel Aviv",
        "byUser": {
            "_id": "u101",
            "fullname": "Alice Chang"
        },
        "createdAt": 1729572948321,
        "city": "Tel Aviv",
        "country": "Israel",
        "stays": [
            {
                "_id": "s105",
                "name": "Rooftop Apartment",
                "type": "City stays",
                "price": 290,
                "cleaningFee": 50,
                "summary": "Charming rooftop apartment with a private terrace overlooking Tel Aviv’s skyline. Features a cozy living room, lush garden corner, and fully equipped kitchen. Ideal for couples or digital nomads wanting a central yet peaceful urban retreat near the beach.",
                "beds": 2,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 3,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.fridge",
                    "kitchen.microwave",
                    "kitchen.coffeeMaker",
                    "bedroom.doubleBed",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "outdoor.diningArea",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Private Rooftop Terrace",
                        "sub": "Enjoy your morning coffee or sunset dinner overlooking the city.",
                        "imgUrl": "outdoor.privatePatio"
                    },
                    {
                        "main": "Prime Location",
                        "sub": "Just steps away from Rothschild Boulevard and Tel Aviv nightlife.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Cozy Charm",
                        "sub": "Bright interiors and comfortable design perfect for couples.",
                        "imgUrl": "features.breakfast"
                    }
                ]
                ,
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u505",
                    "firstName": "Noa",
                    "fullname": "Noa Levi",
                    "location": "Tel Aviv-Yafo, Israel",
                    "pictureUrl": "https://randomuser.me/api/portraits/women/68.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1690500000000,
                    "rating": 4.88,
                    "yearsHosting": 2,
                    "numReviews": 89,
                    "responseRate": 99,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born in Tel Aviv-Yafo" },
                        { "icon": "work", "text": "Works as a graphic designer inspired by city life" }
                    ],
                    "about": "Designer and lifelong Tel Aviv local. I love sharing my favorite cafés and beach spots with guests."
                },
                "loc": {
                    "country": "Israel",
                    "countryCode": "IL",
                    "city": "Tel Aviv-Yafo",
                    "address": "Rothschild Blvd 32, Tel Aviv-Yafo, Israel",
                    "lat": 32.065,
                    "lng": 34.777
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/24671905/661b6f78_original.jpg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/aa461d83-46f2-4c22-b5f7-39fa5f3febac.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/350b471b-f37d-4d73-9e5b-a6dd281e8b80.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/ce0cd732-8a90-42ac-87ea-3d4fe2b9f2f4.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/2c1460c6-6655-44ae-8748-f004117ea1a3.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzQzNTg0NDY=/original/d622991c-1344-4dbe-90df-6317bafc52aa.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-08-20T00:00:00.000Z",
                        "by": {
                            "_id": "u309",
                            "fullname": "Yael",
                            "imgUrl": "https://randomuser.me/api/portraits/women/54.jpg"
                        },
                        "txt": "Loved the rooftop view and location — quiet yet close to everything!",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 5.0,
                            "checkIn": 4.9,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 4
                    },
                    {
                        "at": "2024-09-10T00:00:00.000Z",
                        "by": {
                            "_id": "u310",
                            "fullname": "Ethan",
                            "imgUrl": "https://randomuser.me/api/portraits/men/45.jpg"
                        },
                        "txt": "Great apartment, fantastic host, and that rooftop was a dream!",
                        "rate": {
                            "cleanliness": 4.8,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.8
                        },
                        "nights": 3
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-10-24",
                "availableUntil": "2025-10-30"
            },
            {
                "_id": "s106",
                "name": "Bauhaus Apartment",
                "type": "City stays",
                "price": 450,
                "cleaningFee": 80,
                "summary": "Luxury Bauhaus-style apartment blending modern design with historic Tel Aviv charm. Enjoy three airy bedrooms, a full gourmet kitchen, and a sunny terrace overlooking Rothschild Boulevard. Perfect for families or friends seeking space, sophistication, and proximity to the beach and cafés.",
                "beds": 3,
                "bedrooms": 2,
                "bathrooms": 2,
                "guests": 5,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.airCon",
                    "kitchen.oven",
                    "kitchen.dishwasher",
                    "kitchen.coffeeMaker",
                    "kitchen.fridge",
                    "bedroom.hangers",
                    "bathroom.shampoo",
                    "bathroom.hotWater",
                    "outdoor.pool",
                    "outdoor.terrace",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Infinity Pool with a View",
                        "sub": "Swim while overlooking the Mediterranean coastline.",
                        "imgUrl": "location.pool"
                    },
                    {
                        "main": "Architectural Gem",
                        "sub": "Authentic Bauhaus design featuring clean lines and open spaces.",
                        "imgUrl": "features.gym"
                    },
                    {
                        "main": "Spacious Terrace",
                        "sub": "Perfect for dining al fresco or relaxing under the Tel Aviv sun.",
                        "imgUrl": "outdoor.privatePatio"
                    }
                ],
                "roomType": "Entire home/apt",
                "host": {
                    "_id": "u506",
                    "firstName": "Amit",
                    "fullname": "Amit Cohen",
                    "location": "Tel Aviv-Yafo, Israel",
                    "pictureUrl": "https://randomuser.me/api/portraits/men/33.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "yearsHosting": 4,
                    "signupDate": 1706000000000,
                    "rating": 4.75,
                    "numReviews": 67,
                    "responseRate": 98,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "music", "text": "Guitarist who performs in local bars on weekends" },
                        { "icon": "languages", "text": "Speaks Hebrew, English, and some Spanish" }
                    ],
                    "about": "Architect and host passionate about Tel Aviv’s modernist heritage and Mediterranean lifestyle."
                },
                "loc": {
                    "country": "Israel",
                    "countryCode": "IL",
                    "city": "Tel Aviv-Yafo",
                    "address": "Ben Gurion Blvd 15, Tel Aviv-Yafo, Israel",
                    "lat": 32.0853,
                    "lng": 34.7818
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1494196231683419865/original/f1b8d595-5d15-490d-b41d-2b2fd027d973.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/4279ec7c-7394-4572-a8bb-1445e079fe58.jpeg?im_w=960",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/578a39ea-267c-4f72-82ec-5e80156e7ee5.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/46042ac1-1c91-425a-a49e-8f6dce1d1589.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/3401d91f-551d-4891-a7a6-5d0ae0f3917f.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1499241797877148255/original/f4c96348-cf44-4492-a817-abb442775e7a.jpeg?im_w=480"
                ],
                "reviews": [
                    {
                        "at": "2024-07-21T00:00:00.000Z",
                        "by": {
                            "_id": "u311",
                            "fullname": "Noga",
                            "imgUrl": "https://randomuser.me/api/portraits/women/26.jpg"
                        },
                        "txt": "Incredible design and attention to detail — the pool view was a dream!",
                        "rate": {
                            "cleanliness": 4.9,
                            "communication": 5.0,
                            "checkIn": 4.9,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 5
                    },
                    {
                        "at": "2024-09-02T00:00:00.000Z",
                        "by": {
                            "_id": "u312",
                            "fullname": "Tom",
                            "imgUrl": "https://randomuser.me/api/portraits/men/44.jpg"
                        },
                        "txt": "A stunning apartment in an amazing location — luxurious yet cozy.",
                        "rate": {
                            "cleanliness": 4.8,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.9,
                            "location": 5.0,
                            "value": 4.8
                        },
                        "nights": 4
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-07-07",
                "availableUntil": "2025-07-12"
            },
        ],
    },
    //WL4

    {
        "_id": "wl104",
        "title": "Paris",
        "byUser": {
            "_id": "u101",
            "fullname": "Alice Chang"
        },
        "createdAt": 1729313748321,
        "city": "Paris",
        "country": "France",
        "stays": [
            {
                "_id": "s107",
                "name": "Classic Parisian Apartment",
                "type": "City stays",
                "price": 240,
                "cleaningFee": 45,
                "summary": "Minimalist downtown apartment within walking distance of the Louvre and Notre Dame. Inside, tall windows, herringbone floors, and elegant décor create the quintessential Parisian vibe. Perfect for travelers seeking comfort, charm, and the full Left Bank experience.",
                "beds": 1,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 2,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.heating",
                    "kitchen.fridge",
                    "kitchen.stove",
                    "kitchen.microwave",
                    "bedroom.hangers",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Charming Parisian Interiors",
                        "sub": "Classic high ceilings, large windows, and parquet floors.",
                        "imgUrl": "features.breakfast"
                    },
                    {
                        "main": "Central Location",
                        "sub": "A short walk to the Louvre, Seine River, and metro lines.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Perfect for Couples",
                        "sub": "Romantic atmosphere with views of typical Paris rooftops.",
                        "imgUrl": "outdoor.sunLoungers"
                    }
                ]
                ,
                "roomType": "Entire apartment",
                "host": {
                    "_id": "u507",
                    "firstName": "Camille",
                    "fullname": "Camille Dubois",
                    "location": "Paris, France",
                    "pictureUrl": "https://randomuser.me/api/portraits/women/47.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1721500000000,
                    "yaersHosting": 5,
                    "rating": 4.5,
                    "numReviews": 45,
                    "responseRate": 96,
                    "responseTime": "within a few hours",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born and raised in Paris" },
                        { "icon": "work", "text": "Works as an interior designer with a love for vintage markets" }
                    ],
                    "about": "Art historian and Paris native who loves recommending hidden art galleries and cozy cafés."
                },
                "loc": {
                    "country": "France",
                    "countryCode": "FR",
                    "city": "Paris",
                    "address": "Rue Saint-Honoré, Paris, France",
                    "lat": 48.8619,
                    "lng": 2.3361
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/miso/Hosting-8152916/original/8109a5bc-665a-4d06-a40f-1c6c020bc17e.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/136fdbc5-a6f9-494f-a716-bb0bf4f85b99.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/da8cdbec-1961-4beb-9faa-860d46182918.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/4d4b68ef-eb39-4363-a1d1-21b8f7d8c4bc.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/e7fcb3cf-ea93-4414-8a6f-baba9fed8c68.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1502839437221730399/original/40eebbf6-592f-437b-957e-07424921e323.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-05-17T00:00:00.000Z",
                        "by": {
                            "_id": "u313",
                            "fullname": "Julien",
                            "imgUrl": "https://randomuser.me/api/portraits/men/25.jpg"
                        },
                        "txt": "Lovely and quiet apartment, very clean and close to everything. Would definitely return.",
                        "rate": {
                            "cleanliness": 4.7,
                            "communication": 4.9,
                            "checkIn": 4.9,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.6
                        },
                        "nights": 3
                    },
                    {
                        "at": "2024-08-03T00:00:00.000Z",
                        "by": {
                            "_id": "u314",
                            "fullname": "Sophia",
                            "imgUrl": "https://randomuser.me/api/portraits/women/37.jpg"
                        },
                        "txt": "Perfect place for our romantic weekend in Paris. The host was so welcoming!",
                        "rate": {
                            "cleanliness": 4.6,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.8,
                            "location": 5.0,
                            "value": 4.7
                        },
                        "nights": 2
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-05-15",
                "availableUntil": "2025-05-18"
            },
            {
                "_id": "s108",
                "name": "Rooftop Paris Apartment",
                "type": "Historic stays",
                "price": 310,
                "cleaningFee": 55,
                "summary": "Elegant suite atop a historic Haussmann building, combining old-world charm with modern comfort. The rooftop terrace offers sweeping Paris skyline views, while inside you’ll find vintage furnishings, soft lighting, and a peaceful bedroom retreat just minutes from Montmartre and the Opera.",
                "beds": 1,
                "bedrooms": 1,
                "bathrooms": 1,
                "guests": 2,
                "amenities": [
                    "essentials.wifi",
                    "essentials.tv",
                    "essentials.heating",
                    "kitchen.fridge",
                    "kitchen.stove",
                    "kitchen.coffeeMaker",
                    "bedroom.hangers",
                    "bathroom.hotWater",
                    "bathroom.shampoo",
                    "outdoor.terrace",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.smokeAlarm"
                ],
                "highlights": [
                    {
                        "main": "Rooftop Views",
                        "sub": "Enjoy your morning espresso with breathtaking views of Paris rooftops.",
                        "imgUrl": "outdoor.privatePatio"
                    },
                    {
                        "main": "Historic Building",
                        "sub": "Beautifully preserved 19th-century architecture with updated amenities.",
                        "imgUrl": "location.center"
                    },
                    {
                        "main": "Romantic Suite",
                        "sub": "Soft lighting and vintage touches create the perfect Parisian atmosphere.",
                        "imgUrl": "essentials.workSpace"
                    }
                ]
                ,
                "roomType": "Entire suite",
                "host": {
                    "_id": "u508",
                    "firstName": "Étienne",
                    "fullname": "Étienne Laurent",
                    "location": "Paris, France",
                    "pictureUrl": "https://randomuser.me/api/portraits/men/52.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "yearsHosting": 4,
                    "signupDate": 1737000000000,
                    "rating": 4.2,
                    "numReviews": 38,
                    "responseRate": 95,
                    "responseTime": "within a few hours",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "school", "text": "Studied culinary arts at Le Cordon Bleu" },
                        { "icon": "languages", "text": "Speaks French, English, and Italian" }
                    ],
                    "about": "Architect and Paris native, passionate about restoring old buildings and sharing their charm with guests."
                },
                "loc": {
                    "country": "France",
                    "countryCode": "FR",
                    "city": "Paris",
                    "address": "Boulevard Haussmann, Paris, France",
                    "lat": 48.8738,
                    "lng": 2.3321
                },
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1477518867707399158/original/675952f5-76eb-4d4c-91f5-e05634c2771a.png?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/a2c850cf-9502-4ca9-ba3e-98e3c3bac24c.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/23497bce-770e-4792-bf51-e0e30d0d459d.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/832a3ec0-e5a2-4bdd-a363-b31d71268e7e.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/267eeaf6-9627-4c06-8882-23abcb0dc848.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1231991186372791293/original/2095d94f-adcd-4b2d-a696-be7ff10a6b66.jpeg?im_w=960"
                ],
                "reviews": [
                    {
                        "at": "2024-06-22T00:00:00.000Z",
                        "by": {
                            "_id": "u315",
                            "fullname": "Elena",
                            "imgUrl": "https://randomuser.me/api/portraits/women/43.jpg"
                        },
                        "txt": "Beautiful rooftop suite with amazing views — so Parisian and cozy!",
                        "rate": {
                            "cleanliness": 4.7,
                            "communication": 4.9,
                            "checkIn": 4.8,
                            "accuracy": 4.7,
                            "location": 5.0,
                            "value": 4.5
                        },
                        "nights": 3
                    },
                    {
                        "at": "2024-08-05T00:00:00.000Z",
                        "by": {
                            "_id": "u316",
                            "fullname": "Victor",
                            "imgUrl": "https://randomuser.me/api/portraits/men/46.jpg"
                        },
                        "txt": "Romantic getaway spot. The building had so much charm — we loved it!",
                        "rate": {
                            "cleanliness": 4.6,
                            "communication": 5.0,
                            "checkIn": 5.0,
                            "accuracy": 4.7,
                            "location": 5.0,
                            "value": 4.6
                        },
                        "nights": 2
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-05-19",
                "availableUntil": "2025-05-23"
            },
        ]
    },
    //WL5

    {
        "_id": 'wl105',
        "title": 'Bali Bungalow',
        "byUser": {
            "_id": "u101",
            "fullname": "Alice Chang"
        },
        "createdAt": 1726400000,
        "city": 'Denpasar',
        "country": 'Indonesia',
        "stays": [
            {
                "_id": "s109",
                "name": "Rustic Bungalow",
                "type": "Beach stays",
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/miso/Hosting-52676634/original/c6447fe3-1ea3-40c4-a347-56a5d79b7e18.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/fd0a9286-082a-4805-b73c-2d7096ae1438.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/e15439c8-9f25-4fcb-91d7-7c9275004758.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/8b33b148-508b-48b7-9317-d6b8fae9e8cd.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-1430825605016107872/original/44ff42c0-df3e-4852-a1b5-751b65487a50.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/miso/Hosting-1430798282653568595/original/2178b294-3421-40e1-ab26-7ff5f532beb5.jpeg?im_w=960"
                ],
                "price": 180,
                "cleaningFee": 30,
                "summary": "Beachfront bungalow with hammock, barbecue, and direct sand access. Wake up to ocean breezes, relax on the shaded deck, and enjoy sunset dinners under palm trees. A tranquil hideaway blending rustic design with tropical comfort, just minutes from local cafés and surf spots.",
                "rooms": [
                    {
                        "roomType": "bungalow",
                        "bedType": "double bed",
                        "imgUrl": "https://a0.muscache.com/im/pictures/miso/Hosting-52676634/original/c6447fe3-1ea3-40c4-a347-56a5d79b7e18.jpeg?im_w=720"
                    }
                ],
                "guests": 2,
                "bathrooms": 1,
                "bedrooms": 1,
                "beds": 1,
                "amenities": [
                    "essentials.wifi",
                    "essentials.fan",
                    "essentials.mosquitoNet",
                    "kitchen.fridge",
                    "kitchen.stove",
                    "outdoor.hammock",
                    "outdoor.barbecue",
                    "outdoor.privatePatio",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.fireExtinguisher"
                ],
                "highlights": [
                    {
                        "main": "Beachfront Access",
                        "sub": "Step directly from your terrace onto warm white sand.",
                        "imgUrl": "location.beach"
                    },
                    {
                        "main": "Tropical Charm",
                        "sub": "Handcrafted bamboo furniture and open-air design.",
                        "imgUrl": "features.grill"
                    },
                    {
                        "main": "Relax and Unwind",
                        "sub": "Enjoy sunsets from your private hammock with ocean breeze.",
                        "imgUrl": "outdoor.sunLoungers"
                    }
                ],

                "roomType": "Entire bungalow",
                "host": {
                    "_id": "host-bali-09",
                    "firstName": "Ayu",
                    "fullname": "Ayu Pranata",
                    "location": "Bali, Indonesia",
                    "about": "Local host passionate about Balinese culture and eco-friendly living. I love sharing hidden beaches and food recommendations.",
                    "pictureUrl": "https://randomuser.me/api/portraits/women/56.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1752500000000,
                    "rating": 4.3,
                    "numReviews": 72,
                    "yearsHosting": 3,
                    "responseRate": 98,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "born", "text": "Born in Ubud" },
                        { "icon": "work", "text": "Manages the retreat with her family" }
                    ]
                },
                "loc": {
                    "country": "Indonesia",
                    "countryCode": "ID",
                    "city": "Denpasar",
                    "address": "Jalan Pantai Seseh, Canggu, Bali, Indonesia",
                    "lat": -8.648,
                    "lng": 115.131
                },
                "reviews": [
                    {
                        "at": "2024-07-12T00:00:00.000Z",
                        "by": { "_id": "r-11009", "fullname": "Lina", "imgUrl": "https://randomuser.me/api/portraits/women/42.jpg" },
                        "txt": "We loved waking up to the sound of waves. So peaceful and private!",
                        "rate": { "cleanliness": 4.6, "communication": 4.8, "checkIn": 4.9, "accuracy": 4.5, "location": 5.0, "value": 4.4 },
                        "nights": 4,
                        "withKids": false,
                        "withPet": false
                    },
                    {
                        "at": "2024-08-05T00:00:00.000Z",
                        "by": { "_id": "r-11010", "fullname": "Mateo", "imgUrl": "https://randomuser.me/api/portraits/men/36.jpg" },
                        "txt": "Exactly what we wanted — rustic, quiet, and right on the beach.",
                        "rate": { "cleanliness": 4.5, "communication": 4.9, "checkIn": 4.8, "accuracy": 4.6, "location": 5.0, "value": 4.6 },
                        "nights": 5,
                        "withKids": false,
                        "withPet": false
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-08-02",
                "availableUntil": "2025-08-08"
            },
            {
                "_id": "s110",
                "name": "Bungalow with Balcony",
                "type": "Beach stays",
                "imgUrls": [
                    "https://a0.muscache.com/im/pictures/miso/Hosting-1019120441924581642/original/cf33de17-4728-4eff-86d2-a6d292fb74ba.jpeg?im_w=720",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NDY5NTk4Ng%3D%3D/original/677c3190-37d6-4030-abc6-d151a16d2536.jpeg?im_w=960",
                    "https://a0.muscache.com/im/pictures/66834258/7b4df7a2_original.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NDY5NTk4Ng%3D%3D/original/f8674240-b93d-4910-9f5e-e47e31617797.jpeg?im_w=480",
                    "https://a0.muscache.com/im/pictures/355e3a88-1445-40ef-a137-9493975e9d74.jpg?im_w=480",
                    "https://a0.muscache.com/im/pictures/ccffb1af-e48f-402c-a2f8-4f452bd086c9.jpg?im_w=480"
                ],
                "price": 210,
                "cleaningFee": 35,
                "summary": "Tropical-style bungalow surrounded by palms, with an open deck and cozy hammock — perfect for lazy beach mornings.",
                "rooms": [
                    {
                        "roomType": "bungalow",
                        "bedType": "queen bed",
                        "imgUrl": "https://a0.muscache.com/im/pictures/miso/Hosting-1019120441924581642/original/cf33de17-4728-4eff-86d2-a6d292fb74ba.jpeg?im_w=720"
                    }
                ],
                "guests": 2,
                "bathrooms": 1,
                "bedrooms": 1,
                "beds": 1,
                "amenities": [
                    "essentials.wifi",
                    "essentials.fan",
                    "essentials.mosquitoNet",
                    "kitchen.fridge",
                    "kitchen.kettle",
                    "outdoor.hammock",
                    "outdoor.privatePatio",
                    "outdoor.barbecue",
                    "outdoor.outdoorShower",
                    "services.longStay",
                    "bookingOptions.selfCheckin",
                    "safety.fireExtinguisher"
                ],
                "highlights": [
                    {
                        "main": "Private Balcony",
                        "sub": "Enjoy sunrises from your hammock overlooking tropical gardens.",
                        "imgUrl": "outdoor.privatePatio"
                    },
                    {
                        "main": "Natural Materials",
                        "sub": "Built with bamboo, wood, and stone for an authentic island feel.",
                        "imgUrl": "features.grill"
                    },
                    {
                        "main": "Open-Air Living",
                        "sub": "Spacious deck perfect for reading or yoga.",
                        "imgUrl": "outdoor.sunLoungers"
                    }
                ],
                "roomType": "Entire bungalow",
                "host": {
                    "_id": "host-bali-10",
                    "firstName": "Kadek",
                    "fullname": "Kadek Wayan",
                    "location": "Ubud, Bali, Indonesia",
                    "about": "Balinese host who loves gardening, cooking, and introducing guests to local traditions and culture.",
                    "pictureUrl": "https://randomuser.me/api/portraits/men/53.jpg",
                    "isSuperhost": true,
                    "isVerified": true,
                    "signupDate": 1613000000000,
                    "rating": 4.8,
                    "numReviews": 64,
                    "yearsHosting": 4,
                    "responseRate": 99,
                    "responseTime": "within an hour",
                    "coHosts": [],
                    "personalFacts": [
                        { "icon": "school", "text": "Studied hospitality in Denpasar" },
                        { "icon": "languages", "text": "Speaks Indonesian and English" }
                    ]
                },
                "loc": {
                    "country": "Indonesia",
                    "countryCode": "ID",
                    "city": "Denpasar",
                    "address": "Jalan Raya Uluwatu, Bali, Indonesia",
                    "lat": -8.792,
                    "lng": 115.168
                },
                "reviews": [
                    {
                        "at": "2024-07-18T00:00:00.000Z",
                        "by": { "_id": "r-11011", "fullname": "Anita", "imgUrl": "https://randomuser.me/api/portraits/women/48.jpg" },
                        "txt": "Absolutely gorgeous bungalow — peaceful, bright, and surrounded by nature.",
                        "rate": { "cleanliness": 4.9, "communication": 5.0, "checkIn": 4.9, "accuracy": 4.8, "location": 4.9, "value": 4.7 },
                        "nights": 4,
                        "withKids": false,
                        "withPet": false
                    },
                    {
                        "at": "2024-08-21T00:00:00.000Z",
                        "by": { "_id": "r-11012", "fullname": "Jonas", "imgUrl": "https://randomuser.me/api/portraits/men/32.jpg" },
                        "txt": "Perfect blend of comfort and authenticity. Loved the hammock and view!",
                        "rate": { "cleanliness": 4.8, "communication": 5.0, "checkIn": 5.0, "accuracy": 4.8, "location": 5.0, "value": 4.8 },
                        "nights": 3,
                        "withKids": false,
                        "withPet": false
                    }
                ],
                "likedByUsers": [],
                "availableFrom": "2025-08-10",
                "availableUntil": "2025-08-15"
            }
        ],
    },
]
// export const demoWishlists = baseWishlists.map(wl => ({
//     ...wl,
//     stays: wl.stays.map(minStay => {
//         const fullStay = demoStays.find(s => s._id === minStay._id)
//         return { ...fullStay, ...minStay } // full fields + any overrides
//     })
// }))


