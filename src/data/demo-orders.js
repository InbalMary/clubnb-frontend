export const demoOrders = [
  {
    _id: 'o1225',
    host: {
      _id: 'u102',
      fullname: 'Bob Builder',
      firstName: 'Bob',
      imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      hostingSince: '2019'
    },
    guest: {
      _id: 'u101',
      fullname: 'Alice Guest',
      imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    totalPrice: 510,
    pricePerNight: 150,
    cleaningFee: 40,
    serviceFee: 20,
    numNights: 3,
    startDate: '2025-10-15',
    endDate: '2025-10-18',
    guests: {
      adults: 2,
      children: 1,
      infants: 0,
    },
    stay: {
      _id: 'h102',
      name: 'The Cozy Lake House',
      imgUrl:
        'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NjEyMTY5Mjk1MjM2NzM1NDA4/original/9d312756-dc3f-4f4c-a03f-e83961c128b4.jpeg?im_w=720',
      rating: 4.93,
      numReviews: 128,
      isGuestFavorite: true,
      isRareFind: true,
      host: { firstName: 'Bob' },
    },
    msgs: [
      {
        from: 'guest',
        txt: 'Hi Bob, just confirming check-in time is 3 PM?',
        sentAt: '2025-10-12T09:32:00Z',
      },
    ],
    status: 'pending', // approved / rejected
  },
]
