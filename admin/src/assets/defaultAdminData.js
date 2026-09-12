export const defaultOrders = [
  {
    "_id": "order_1788793336467",
    "date": "2026-09-07T15:02:16.467Z",
    "status": "Out for delivery",
    "payment": true,
    "userId": "user_1788793074212",
    "items": [
      {
        "_id": "food_29",
        "name": "Butter Noodles",
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
        "price": 13,
        "description": "Hand-pulled egg noodles tossed in browned butter, chives, and cracked black pepper.",
        "category": "Noodles",
        "quantity": 1
      },
      {
        "_id": "food_30",
        "name": "Veg Noodles",
        "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
        "price": 14,
        "description": "Wok-tossed noodles with shredded cabbage, bell peppers, scallions, and soy-ginger glaze.",
        "category": "Noodles",
        "quantity": 1
      }
    ],
    "amount": 29,
    "address": {
      "firstName": "Alex",
      "lastName": "Morgan",
      "email": "alex.demo@tomato.com",
      "street": "742 Evergreen Terrace",
      "city": "Springfield",
      "state": "OR",
      "zipcode": "97477",
      "country": "United States",
      "phone": "+1-555-0199"
    }
  },
  {
    "_id": "order_1789053596184",
    "date": "2026-09-10T15:19:56.189Z",
    "status": "Out for delivery",
    "payment": true,
    "userId": "user_1788793074212",
    "items": [
      {
        "_id": "food_1",
        "name": "Greek Salad",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        "price": 12,
        "description": "Fresh Mediterranean salad with crisp romaine, kalamata olives, feta cheese, and red onions.",
        "category": "Salad",
        "quantity": 1
      },
      {
        "_id": "food_2",
        "name": "Veg Salad",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
        "price": 10,
        "description": "Farm-fresh vegetables, crunchy bell peppers, cucumbers, and a zesty lemon-herb vinaigrette.",
        "category": "Salad",
        "quantity": 2
      }
    ],
    "amount": 34,
    "address": {
      "firstName": "AlexAlex",
      "lastName": "MorganMorgan",
      "email": "alex.demo@tomato.com",
      "street": "742 Evergreen Terrace",
      "city": "Springfield",
      "state": "OR",
      "zipcode": "97477",
      "country": "United States",
      "phone": "+1-555-0199"
    }
  },
  {
    "_id": "order_1789136228812",
    "date": "2026-09-11T14:17:08.812Z",
    "status": "Delivered",
    "payment": false,
    "orderType": "pickup",
    "scheduledFor": "19:30",
    "tableNumber": null,
    "pickupTime": "19:30",
    "userId": "user_test_verify",
    "items": [
      {
        "_id": "food_1",
        "name": "Greek Salad",
        "price": 12,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        "category": "Salad",
        "customization": {
          "portionSize": "Medium",
          "portionPriceDelta": 3.5,
          "spiceLevel": "Medium",
          "addOns": [
            "Extra Cheese (+$1.50)",
            "Extra Kalamata Olives (+$1.00)"
          ],
          "cookingNotes": "Extra dressing on the side, light salt please."
        }
      }
    ],
    "amount": 15.5,
    "address": {
      "firstName": "Elena",
      "lastName": "Rostova",
      "email": "elena.r@tomato.com",
      "street": "Store Pickup - 123 Gourmet Way",
      "city": "Springfield",
      "state": "OR",
      "zipcode": "97477",
      "country": "United States",
      "phone": "+1-555-8899"
    }
  },
  {
    "_id": "order_1789136228828",
    "date": "2026-09-11T14:17:08.828Z",
    "status": "Food Processing",
    "payment": false,
    "orderType": "dine-in",
    "scheduledFor": "ASAP",
    "tableNumber": "Table 4",
    "pickupTime": null,
    "userId": "user_test_verify",
    "items": [
      {
        "_id": "food_4",
        "name": "Chicken Salad",
        "price": 24,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        "category": "Salad",
        "customization": {
          "portionSize": "Large / Family",
          "portionPriceDelta": 7,
          "spiceLevel": "Hot",
          "addOns": [
            "Extra Crispy Bacon (+$2.00)"
          ],
          "cookingNotes": "Dine-in Table 4 - serve fresh and hot."
        }
      }
    ],
    "amount": 62,
    "address": {
      "firstName": "Table 4 Guest",
      "lastName": "Dine-In",
      "email": "table4@restaurant.local",
      "street": "Table 4 - Dining Room",
      "city": "In-House",
      "state": "Local",
      "zipcode": "00000",
      "country": "Local",
      "phone": "+1-555-0004"
    }
  },
  {
    "_id": "order_1789142421951",
    "date": "2026-09-11T16:00:21.951Z",
    "status": "Delivered",
    "payment": false,
    "orderType": "pickup",
    "scheduledFor": "19:30",
    "tableNumber": null,
    "pickupTime": "19:30",
    "riderTip": 0,
    "etaMins": 18,
    "rider": {
      "name": "Raju Bhaiya",
      "vehicle": "Hero Splendor • KA-01-EA-2026",
      "rating": 4.9,
      "deliveries": 1420,
      "phone": "+91 98765 43210",
      "vaccinated": true,
      "status": "On the way with hot food!"
    },
    "userId": "user_test_verify",
    "items": [
      {
        "_id": "food_1",
        "name": "Greek Salad",
        "price": 12,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        "category": "Salad",
        "customization": {
          "portionSize": "Medium",
          "portionPriceDelta": 3.5,
          "spiceLevel": "Medium",
          "addOns": [
            "Extra Cheese (+$1.50)",
            "Extra Kalamata Olives (+$1.00)"
          ],
          "cookingNotes": "Extra dressing on the side, light salt please."
        }
      }
    ],
    "amount": 15.5,
    "address": {
      "firstName": "Elena",
      "lastName": "Rostova",
      "email": "elena.r@tomato.com",
      "street": "Store Pickup - 123 Gourmet Way",
      "city": "Springfield",
      "state": "OR",
      "zipcode": "97477",
      "country": "United States",
      "phone": "+1-555-8899"
    }
  },
  {
    "_id": "order_1789142421970",
    "date": "2026-09-11T16:00:21.970Z",
    "status": "Delivered",
    "payment": false,
    "orderType": "dine-in",
    "scheduledFor": "ASAP",
    "tableNumber": "Table 4",
    "pickupTime": null,
    "riderTip": 0,
    "etaMins": 18,
    "rider": {
      "name": "Raju Bhaiya",
      "vehicle": "Hero Splendor • KA-01-EA-2026",
      "rating": 4.9,
      "deliveries": 1420,
      "phone": "+91 98765 43210",
      "vaccinated": true,
      "status": "On the way with hot food!"
    },
    "userId": "user_test_verify",
    "items": [
      {
        "_id": "food_4",
        "name": "Chicken Salad",
        "price": 24,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        "category": "Salad",
        "customization": {
          "portionSize": "Large / Family",
          "portionPriceDelta": 7,
          "spiceLevel": "Hot",
          "addOns": [
            "Extra Crispy Bacon (+$2.00)"
          ],
          "cookingNotes": "Dine-in Table 4 - serve fresh and hot."
        }
      }
    ],
    "amount": 62,
    "address": {
      "firstName": "Table 4 Guest",
      "lastName": "Dine-In",
      "email": "table4@restaurant.local",
      "street": "Table 4 - Dining Room",
      "city": "In-House",
      "state": "Local",
      "zipcode": "00000",
      "country": "Local",
      "phone": "+1-555-0004"
    }
  }
];

export const defaultReservations = [
  {
    "_id": "res_sample_1",
    "bookingCode": "RES-8421",
    "name": "Sophia Martinez",
    "email": "alex.demo@tomato.com",
    "phone": "+1-555-0144",
    "guests": 4,
    "date": "2026-09-12",
    "timeSlot": "7:00 PM",
    "seatingArea": "Garden Patio",
    "specialOccasion": "Anniversary",
    "specialRequests": "Window/garden side table if possible please.",
    "status": "Confirmed",
    "createdAt": "2026-09-10T13:33:53.883Z"
  },
  {
    "_id": "res_sample_2",
    "bookingCode": "RES-5912",
    "name": "David Chen",
    "email": "david.c@example.com",
    "phone": "+1-555-0182",
    "guests": 2,
    "date": "2026-09-11",
    "timeSlot": "8:30 PM",
    "seatingArea": "Rooftop Lounge",
    "specialOccasion": "Date Night",
    "specialRequests": "Quiet corner table.",
    "status": "Confirmed",
    "createdAt": "2026-09-10T10:33:53.884Z"
  },
  {
    "_id": "res_1789055060302",
    "bookingCode": "RES-5507",
    "createdAt": "2026-09-10T15:44:20.307Z",
    "status": "Confirmed",
    "name": "Alex Morgan",
    "email": "alex.demo@tomato.com",
    "phone": "+1 (555) 234-5678",
    "guests": 4,
    "date": "2026-09-11",
    "timeSlot": "7:00 PM",
    "seatingArea": "Garden Patio",
    "specialOccasion": "Casual Gathering",
    "specialRequests": "Celebrating anniversary, window table please"
  },
  {
    "_id": "res_1789136084068",
    "bookingCode": "RES-8491",
    "createdAt": "2026-09-11T14:14:44.073Z",
    "status": "Confirmed",
    "name": "Elena Rostova",
    "email": "elena.r@tomato.com",
    "phone": "+1-555-8899",
    "guests": 4,
    "date": "2026-09-15",
    "timeSlot": "8:00 PM",
    "seatingArea": "Rooftop Lounge",
    "specialOccasion": "Anniversary",
    "specialRequests": "Romantic sunset view table, celebratory dessert"
  },
  {
    "_id": "res_1789136130760",
    "bookingCode": "RES-9804",
    "createdAt": "2026-09-11T14:15:30.760Z",
    "status": "Confirmed",
    "name": "Elena Rostova",
    "email": "elena.r@tomato.com",
    "phone": "+1-555-8899",
    "guests": 4,
    "date": "2026-09-15",
    "timeSlot": "8:00 PM",
    "seatingArea": "Rooftop Lounge",
    "specialOccasion": "Anniversary",
    "specialRequests": "Romantic sunset view table, celebratory dessert"
  },
  {
    "_id": "res_1789136228731",
    "bookingCode": "RES-1301",
    "createdAt": "2026-09-11T14:17:08.734Z",
    "status": "Seated",
    "name": "Elena Rostova",
    "email": "elena.r@tomato.com",
    "phone": "+1-555-8899",
    "guests": 4,
    "date": "2026-09-15",
    "timeSlot": "8:00 PM",
    "seatingArea": "Rooftop Lounge",
    "specialOccasion": "Anniversary",
    "specialRequests": "Romantic sunset view table, celebratory dessert"
  },
  {
    "_id": "res_1789142421858",
    "bookingCode": "RES-7848",
    "createdAt": "2026-09-11T16:00:21.859Z",
    "status": "Seated",
    "name": "Elena Rostova",
    "email": "elena.r@tomato.com",
    "phone": "+1-555-8899",
    "guests": 4,
    "date": "2026-09-15",
    "timeSlot": "8:00 PM",
    "seatingArea": "Rooftop Lounge",
    "specialOccasion": "Anniversary",
    "specialRequests": "Romantic sunset view table, celebratory dessert"
  }
];
