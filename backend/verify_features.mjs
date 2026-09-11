// Comprehensive verification script for KitchenAsty + Delivery_App features

async function runVerification() {
  console.log("=== STARTING FULL STACK VERIFICATION ===\n");
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, name) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${name}`);
      process.exitCode = 1;
    }
  }

  const BASE_URL = "http://localhost:4000";

  // 1. Table Reservation: Book table
  console.log("--- Test Suite 1: Table Reservation System ---");
  const resPayload = {
    name: "Elena Rostova",
    email: "elena.r@tomato.com",
    phone: "+1-555-8899",
    guests: 4,
    date: "2026-09-15",
    timeSlot: "8:00 PM",
    seatingArea: "Rooftop Lounge",
    specialOccasion: "Anniversary",
    specialRequests: "Romantic sunset view table, celebratory dessert"
  };

  const bookRes = await fetch(`${BASE_URL}/api/reservation/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resPayload)
  }).then(r => r.json());

  assert(bookRes.success === true, "Reservation booked successfully");
  assert(bookRes.data && bookRes.data.bookingCode && bookRes.data.bookingCode.startsWith("RES-"), `Booking code generated: ${bookRes.data?.bookingCode}`);
  assert(bookRes.data?.status === "Confirmed", "Reservation initial status is Confirmed");
  const bookingId = bookRes.data?._id;

  // 2. Table Reservation: List all reservations (Admin view)
  const listRes = await fetch(`${BASE_URL}/api/reservation/list`).then(r => r.json());
  assert(listRes.success === true, "Admin reservations list retrieved");
  const foundRes = listRes.data?.find(r => r._id === bookingId);
  assert(!!foundRes, `Found newly booked reservation in admin list (${foundRes?.bookingCode})`);
  assert(foundRes?.seatingArea === "Rooftop Lounge", "Reservation seating area preserved correctly");

  // 3. Table Reservation: Update status (Admin actions: Seat Guests / Cancel)
  const updateRes = await fetch(`${BASE_URL}/api/reservation/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservationId: bookingId, status: "Seated" })
  }).then(r => r.json());
  assert(updateRes.success === true, "Reservation status updated to Seated");
  assert(updateRes.data?.status === "Seated", "Updated reservation has status 'Seated'");

  // 4. Table Reservation: User bookings query
  const userRes = await fetch(`${BASE_URL}/api/reservation/user?email=elena.r@tomato.com`).then(r => r.json());
  assert(userRes.success === true, "Customer user reservations query successful");
  assert(userRes.data?.length >= 1, "Customer retrieved their reservation history");

  // 5. Order Customizations & Fulfillment: Store Pickup with Portion Sizing
  console.log("\n--- Test Suite 2: Product Customization & Order Fulfillment ---");
  const orderPickupPayload = {
    userId: "user_test_verify",
    items: [
      {
        _id: "food_1",
        name: "Greek Salad",
        price: 12,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        category: "Salad",
        customization: {
          portionSize: "Medium",
          portionPriceDelta: 3.5,
          spiceLevel: "Medium",
          addOns: ["Extra Cheese (+$1.50)", "Extra Kalamata Olives (+$1.00)"],
          cookingNotes: "Extra dressing on the side, light salt please."
        }
      }
    ],
    amount: 15.5, // 12 + 3.5
    address: {
      firstName: "Elena",
      lastName: "Rostova",
      email: "elena.r@tomato.com",
      street: "Store Pickup - 123 Gourmet Way",
      city: "Springfield",
      state: "OR",
      zipcode: "97477",
      country: "United States",
      phone: "+1-555-8899"
    },
    orderType: "pickup",
    scheduledFor: "19:30",
    pickupTime: "19:30"
  };

  const placePickupOrder = await fetch(`${BASE_URL}/api/order/place`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPickupPayload)
  }).then(r => r.json());

  assert(placePickupOrder.success === true, "Store pickup order placed successfully");
  const pickupOrderId = placePickupOrder.orderId || placePickupOrder.data?._id;

  // 6. Order Fulfillment: Dine-In Table Ordering
  const orderDineInPayload = {
    userId: "user_test_verify",
    items: [
      {
        _id: "food_4",
        name: "Chicken Salad",
        price: 24,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        category: "Salad",
        customization: {
          portionSize: "Large / Family",
          portionPriceDelta: 7.0,
          spiceLevel: "Hot",
          addOns: ["Extra Crispy Bacon (+$2.00)"],
          cookingNotes: "Dine-in Table 4 - serve fresh and hot."
        }
      }
    ],
    amount: 62.0, // (24 + 7) * 2
    address: {
      firstName: "Table 4 Guest",
      lastName: "Dine-In",
      email: "table4@restaurant.local",
      street: "Table 4 - Dining Room",
      city: "In-House",
      state: "Local",
      zipcode: "00000",
      country: "Local",
      phone: "+1-555-0004"
    },
    orderType: "dine-in",
    tableNumber: "Table 4",
    scheduledFor: "ASAP"
  };

  const placeDineInOrder = await fetch(`${BASE_URL}/api/order/place`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderDineInPayload)
  }).then(r => r.json());

  assert(placeDineInOrder.success === true, "Dine-In table order placed successfully");
  const dineInOrderId = placeDineInOrder.orderId || placeDineInOrder.data?._id;

  // 7. Kitchen Display System (KDS): Retrieve orders & verify customizations
  console.log("\n--- Test Suite 3: Kitchen Display System (KDS) Kanban Flow ---");
  const allOrdersRes = await fetch(`${BASE_URL}/api/order/list`).then(r => r.json());
  assert(allOrdersRes.success === true, "Admin orders list retrieved for KDS board");

  const verifiedPickup = allOrdersRes.data?.find(o => o._id === pickupOrderId);
  assert(!!verifiedPickup, "Pickup order found in KDS orders");
  assert(verifiedPickup?.orderType === "pickup", `Order type is '${verifiedPickup?.orderType}'`);
  assert(verifiedPickup?.scheduledFor === "19:30", `Scheduled for '${verifiedPickup?.scheduledFor}'`);
  assert(verifiedPickup?.items[0]?.customization?.portionSize === "Medium", "Portion size 'Medium' persisted");
  assert(verifiedPickup?.items[0]?.customization?.cookingNotes?.includes("Extra dressing"), "Cooking note persisted");

  const verifiedDineIn = allOrdersRes.data?.find(o => o._id === dineInOrderId);
  assert(!!verifiedDineIn, "Dine-in order found in KDS orders");
  assert(verifiedDineIn?.orderType === "dine-in", "Dine-in order type verified");
  assert(verifiedDineIn?.tableNumber === "Table 4", "Table number 'Table 4' verified");

  // 8. KDS State Transitions: Order Placed -> Food Processing -> Out for delivery/Ready -> Delivered
  console.log("\n--- Test Suite 4: KDS Stage Transitions ---");
  // Move Pickup order to "In Kitchen" (Food Processing)
  const toKitchen = await fetch(`${BASE_URL}/api/order/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: pickupOrderId, status: "Food Processing" })
  }).then(r => r.json());
  assert(toKitchen.success === true, "Order transitioned to 'Food Processing' (In Kitchen)");

  // Move Pickup order to "Ready" (Out for delivery / Ready for pickup)
  const toReady = await fetch(`${BASE_URL}/api/order/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: pickupOrderId, status: "Out for delivery" })
  }).then(r => r.json());
  assert(toReady.success === true, "Order transitioned to 'Ready for pickup'");

  // Move Pickup order to "Delivered" (Completed)
  const toCompleted = await fetch(`${BASE_URL}/api/order/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: pickupOrderId, status: "Delivered" })
  }).then(r => r.json());
  assert(toCompleted.success === true, "Order transitioned to 'Delivered' (Completed)");

  console.log(`\n========================================`);
  console.log(`VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log(`========================================\n`);

  if (passedTests === totalTests) {
    console.log("All KitchenAsty + Delivery_App features are fully operational!");
  } else {
    process.exitCode = 1;
  }
}

runVerification().catch(err => {
  console.error("Verification failed with error:", err);
  process.exit(1);
});
