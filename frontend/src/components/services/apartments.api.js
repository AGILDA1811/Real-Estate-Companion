// TEMP FAKE API (replace later with real backend fetch)
import apartment1 from "../../assets/apartments/apartment-1.svg";
import apartment2 from "../../assets/apartments/apartment-2.svg";
import apartment3 from "../../assets/apartments/apartment-3.svg";

const fakeApartments = [
  {
    id: "1",
    title: "Contemporary two-bedroom apartment",
    location: "Tirana Center",
    price: 650,
    estimatedPrice: 730,
    size: 75,
    meters: 75,
    rooms: 2,
    bathrooms: 1,
    floor: 4,
    hasCompleteInfo: true,
    images: [apartment1, apartment2, apartment3],
    image: apartment1,
    description:
      "Modern apartment near the city center with a practical layout, bright living area, and easy access to transport and everyday services. Ideal for professionals and couples looking for a central location.",
  },
  {
    id: "2",
    title: "Spacious family apartment with open plan",
    location: "Blloku",
    price: 850,
    estimatedPrice: 820,
    size: 95,
    meters: 95,
    rooms: 3,
    bathrooms: 2,
    floor: 6,
    hasCompleteInfo: true,
    images: [apartment2, apartment3, apartment1],
    image: apartment2,
    description:
      "Spacious apartment with natural light and a generous living room. Located in a lively area with cafes, schools, and green spaces nearby. Suitable for families who need more space and convenience.",
  },
  {
    id: "3",
    title: "Cozy apartment for first-time renters",
    location: "Komuna e Parisit",
    price: 500,
    estimatedPrice: 580,
    size: 60,
    meters: 60,
    rooms: 1,
    bathrooms: 1,
    floor: 2,
    hasCompleteInfo: false,
    images: [apartment3, apartment1],
    image: apartment3,
    description:
      "Cozy apartment perfect for students or first-time renters. Compact but efficient floor plan, with nearby grocery stores and direct bus connections.",
  },
  {
    id: "4",
    title: "Large apartment with balcony views",
    location: "Liqeni i Thate",
    price: 1100,
    estimatedPrice: 1240,
    size: 120,
    meters: 120,
    rooms: 4,
    bathrooms: 2,
    floor: 8,
    hasCompleteInfo: true,
    images: [apartment1, apartment3, apartment2],
    image: apartment1,
    description:
      "Large family apartment featuring a balcony with open views, spacious bedrooms, and a comfortable kitchen area. Quiet neighborhood with easy road access.",
  },
  {
    id: "5",
    title: "Renovated apartment in residential street",
    location: "Myslym Shyri",
    price: 740,
    estimatedPrice: 760,
    size: 82,
    meters: 82,
    rooms: 2,
    bathrooms: 1,
    floor: 3,
    hasCompleteInfo: true,
    images: [apartment2, apartment1, apartment3],
    image: apartment2,
    description:
      "Freshly renovated apartment in a calm residential area. Functional interiors and quality finishes make this a balanced option for long-term living.",
  },
  {
    id: "6",
    title: "Bright three-bedroom with parking",
    location: "Don Bosko",
    price: 920,
    estimatedPrice: 980,
    size: 101,
    meters: 101,
    rooms: 3,
    bathrooms: 2,
    floor: 5,
    hasCompleteInfo: true,
    images: [apartment3, apartment2, apartment1],
    image: apartment3,
    description:
      "Bright apartment with practical layout, storage space, and dedicated parking. A solid option for buyers looking for good size-to-price value.",
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchApartments() {
  await delay(350);
  return fakeApartments;
}

export async function fetchApartmentById(id) {
  await delay(250);
  return fakeApartments.find((a) => a.id === id) || null;
}
