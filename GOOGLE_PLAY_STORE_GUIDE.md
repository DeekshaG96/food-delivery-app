# 🌶️ NaanStop - Google Play Console Release Handbook

This guide contains everything required to publish **NaanStop (com.naanstop.delivery)** to the **Google Play Store**, pass Google Play policy audits, and generate production-signed Android App Bundles (`.aab`).

---

## 1. App Store Listing Metadata

### App Details
- **App Name**: `NaanStop: Desi Food Delivery`
- **Short Description (80 characters max)**:
  `Authentic Desi curries, dum biryani, tandoori grills & express delivery!` *(71 chars)*
- **Category**: Food & Drink
- **Default Language**: English (United States / India)
- **Content Rating**: Everyone / Teen (IARC rating)

### Full Description (Play Store Copy)
```text
Craving sizzling butter chicken, aromatic Lucknowi dum biryani, or buttery garlic naan straight from the tandoor? Welcome to NaanStop 🌶️ — your neighborhood desi canteen delivered piping hot to your doorstep!

🔥 WHY FOODIES LOVE NAANSTOP:
• Authentic Dhaba & Canteen Flavors: Hand-crafted gravies, slow-cooked charcoal dum biryanis, and crisp tandoori breads made fresh to order.
• Live Order Tracking & GPS Telemetry: Follow Raju Bhaiya's delivery bike in real-time from our kitchen to your doorstep with live ETA counters.
• Pure Veg 🥬 & Dietary Filters: Easily toggle 100% Pure Veg mode, Jain-friendly dishes, and Halal options with a single tap.
• Chakkar of Luck 🎡: Spin our interactive daily wheel to win instant dish discounts, free gulab jamuns, and delivery fee waivers!
• Custom Spice & Size Selector: Tailor your heat level from Mild to Desi Teekha (3x Fire), choose personal or family party sizes, and add extra tadka.
• Flexible & Safe Payments: Pay instantly using UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, or Cash on Delivery (COD).
• Offline-Ready Receipts: Access your complete order history, item breakdowns, and reorder your favorite meals with 1 tap even on patchy connections.
• Friendly Customer Support: In-app instant chat assistance, FAQ center, and direct kitchen hotline for rapid assistance.

Download NaanStop today and bring the warmth of authentic desi cooking home!
```

---

## 2. Generating Your Production Signing Keystore

Before publishing to Google Play, Android requires that release bundles are digitally signed with an RSA key.

Run the following command in your terminal:

```bash
keytool -genkey -v -keystore naanstop-release.keystore -alias naanstop -keyalg RSA -keysize 2048 -validity 10000
```

> [!IMPORTANT]
> **Store your keystore securely!**
> - Keep `naanstop-release.keystore` and its password backed up safely in a private password manager.
> - Never commit `.keystore` files or passwords to public GitHub repositories.

---

## 3. Building Release Bundles (APK / AAB)

### Option A: Cloud Automated Build (Recommended)
We have included an automated GitHub Actions pipeline in [`.github/workflows/android-build.yml`](.github/workflows/android-build.yml).

1. Push code to GitHub:
   ```bash
   git push origin main
   ```
2. Navigate to **GitHub Repository -> Actions -> Build NaanStop Android App**.
3. Click **Run workflow** (select `release` or `all`).
4. Once completed, download the built artifacts:
   - `naanstop-debug-apk`: For immediate testing on your Android phone.
   - `naanstop-google-play-bundle-aab`: The official Android App Bundle for Google Play Console.

### Option B: Local Android Studio Build
1. Open the project in Android Studio:
   ```bash
   cd frontend
   npx cap open android
   ```
2. In Android Studio, go to **Build -> Generate Signed Bundle / APK...**.
3. Select **Android App Bundle (.aab)**.
4. Choose your `naanstop-release.keystore`, enter the password and alias `naanstop`.
5. Select destination folder and choose **Release**.
6. The resulting `.aab` file will be located in `android/app/release/`.

---

## 4. Google Play Console Compliance & Policy Answers

When filling out the **Policy and Programs** questionnaires in Google Play Console, use the exact answers below:

### A. Privacy Policy
- **Privacy Policy URL**:
  `https://deekshag96.github.io/food-delivery-app/#/`
  *(Also accessible natively in-app via the bottom navigation Legal modal & Profile drawer)*.

### B. App Access & Reviewer Credentials
- **Does your app require credentials to access?**:
  `No. Users can browse the entire menu, customize dishes, add to cart, spin the Chakkar of Luck, and complete guest checkout with local order tracking without creating an account or logging in.`
- **Guest Test Scenario for Reviewer**:
  `Tap any dish -> Tap 'Add to Cart' -> Proceed to Checkout -> Tap 'Place Order' -> Instantly view live delivery simulation and digital receipt in My Orders.`

### C. Account & Data Deletion (Google Play Mandate 2024+)
- **Does your app provide in-app account and data deletion?**:
  `Yes. Users can tap the Profile icon in the top header or bottom navigation -> Tap 'Erase All Data & Account' -> Confirm. All cached tokens, local order history, saved addresses, and profile details are completely wiped from device storage.`

### D. Data Safety Section
| Data Type | Collected? | Shared? | Purpose | Ephemeral? |
| :--- | :--- | :--- | :--- | :--- |
| **Name** | Yes (Optional) | No | App functionality (delivery label) | Yes |
| **Phone Number** | Yes (Optional) | No | Order delivery contact (Raju Bhaiya) | Yes |
| **Physical Address** | Yes | No | Delivery fulfillment | Yes |
| **Financial / Payment Info**| No | No | Payments handled via standard UPI/Gateway intents | N/A |
| **Location** | No background tracking | No | User enters delivery address manually | N/A |

- **Is data encrypted in transit?**: `Yes, all network traffic utilizes TLS 1.3 / HTTPS`.

### E. Target Audience & Content
- **Target Age**: 13 years and older (or 18+ depending on region).
- **Does your app appeal to children?**: No.
- **Ads**: No (Select "My app does not contain ads").
- **Financial Features**: No (Select "Not a financial or crypto app").
- **Government Services**: No.

---

## 5. Visual Assets Checklist for Google Play Store

Prepare the following graphic assets before submitting:
- **App Icon**: 512 × 512 px PNG (32-bit color with alpha, max 1024 KB).
- **Feature Graphic**: 1024 × 500 px JPEG or 24-bit PNG (no alpha).
- **Phone Screenshots**: Minimum 4 screenshots (aspect ratio 16:9 or 9:16, e.g., 1080 × 2400 px):
  1. *Menu Showcase*: Rich cards, Pure Veg toggle, Category pills.
  2. *Customization Sheet*: Spice slider, party sizes, add-ons.
  3. *Chakkar of Luck*: Interactive spin wheel with reward confetti.
  4. *Live Delivery Tracker*: Raju Bhaiya GPS telemetry, route simulator, and receipt breakdown.

---

## 6. Pre-Launch Testing Checklist

- [x] Responsive on small and large mobile viewports (360px – 430px).
- [x] Native safe-area notch padding (`env(safe-area-inset-top)`).
- [x] Hardware back button intercepted to close open modals rather than exiting.
- [x] In-app Haptic feedback enabled for cart, spin wheel, and tabs.
- [x] Offline / Guest checkout tested with zero server dependencies.
- [x] Privacy Policy & Terms of Service reachable directly within 2 taps.
- [x] 1-Tap Account & Data Deletion verified.
