/* ==========================================================================
   config.js
   Central configuration for WantToTry Studio website.
   This is a fully static site — booking submissions are sent straight to
   WhatsApp as a pre-filled message, no database or backend required.
   ========================================================================== */

const CONFIG = {

  // WhatsApp number used by the floating button, Contact page, and the
  // Booking form. International format, no + or leading zeros, digits only.
  WHATSAPP_NUMBER: "6285706282240",

  // Operating hours. Slots are generated automatically between OPEN and
  // CLOSE, spaced by SLOT_MINUTES. 0 = Sunday ... 6 = Saturday.
  // Open every day, no closed day.
  HOURS: {
    // Monday(1) - Thursday(4)
    weekday: { days: [1, 2, 3, 4], open: "10:00", close: "20:00" },
    // Friday(5) - Saturday(6) - Sunday(0)
    weekend: { days: [5, 6, 0], open: "08:00", close: "20:00" },
    closedDays: []
  },
  SLOT_MINUTES: 20,

  // Pricing data, mirrors the Pricelist page. Used by booking.js to compute
  // the live summary total.
  PACKAGES: {
    "vintage-tirai": {
      label: "Vintage & Tirai Box",
      backgrounds: ["Vintage Box", "Tirai Box"],
      pkgs: {
        "duo":   { label: "Duo Box",   price: 35000, people: "1-2 Orang", minutes: 12 },
        "party": { label: "Party Box", price: 50000, people: "3-4 Orang", minutes: 15 }
      }
    },
    "elevator": {
      label: "Elevator Box",
      backgrounds: ["Elevator Box"],
      pkgs: {
        "duo":   { label: "Duo Box",   price: 35000, people: "1-2 Orang", minutes: 12 },
        "party": { label: "Party Box", price: 50000, people: "3-4 Orang", minutes: 15 }
      }
    },
    "retro": {
      label: "Retro Room",
      backgrounds: ["Retro Room"],
      pkgs: {
        "duo":   { label: "Duo Room",   price: 35000, people: "1-2 Orang", minutes: 12 },
        "party": { label: "Party Room", price: 60000, people: "3-6 Orang", minutes: 15 }
      }
    },
    "color": {
      label: "Color Background",
      backgrounds: ["Color Background 1", "Color Background 2", "Color Background 3", "Color Background 4"],
      pkgs: {
        "duo":   { label: "Duo Studio",   price: 35000, people: "1-2 Orang", minutes: 12 },
        "party": { label: "Party Studio", price: 60000, people: "3-6 Orang", minutes: 15 }
      }
    }
  },

  ADDONS: {
    extraTime5min: 10000,
    extraPerson: 10000,
    print4R: 5000,
    printStrip2: 6000
  }
};
