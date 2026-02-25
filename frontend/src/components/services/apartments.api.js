// TEMP FAKE API (replace later with real backend fetch)
import apartment1 from "../../assets/apartments/apartment-1.svg";
import apartment2 from "../../assets/apartments/apartment-2.svg";
import apartment3 from "../../assets/apartments/apartment-3.svg";

const fakeApartments = [
  {
    id: "1",
    price: 650,
    estimatedPrice: 730,
    meters: 75,
    rooms: 2,
    location: "Tirana Center",
    image: apartment1,
    description: "Modern apartment near the city center.",
  },
  {
    id: "2",
    price: 850,
    estimatedPrice: 820,
    meters: 95,
    rooms: 3,
    location: "Blloku",
    image: apartment2,
    description: "Spacious apartment with natural light.",
  },
  {
    id: "3",
    price: 500,
    estimatedPrice: 580,
    meters: 60,
    rooms: 1,
    location: "Komuna e Parisit",
    image: apartment3,
    description: "Cozy apartment perfect for students.",
  },
  {
    id: "4",
    price: 1100,
    estimatedPrice: 1240,
    meters: 120,
    rooms: 4,
    location: "Liqeni i Thate",
    image: apartment1,
    description: "Large family apartment with balcony and lake access.",
  },
  {
    id: "5",
    price: 740,
    estimatedPrice: 760,
    meters: 82,
    rooms: 2,
    location: "Myslym Shyri",
    image: apartment2,
    description: "Freshly renovated apartment in a quiet residential street.",
  },
  {
    id: "6",
    price: 920,
    estimatedPrice: 980,
    meters: 101,
    rooms: 3,
    location: "Don Bosko",
    image: apartment3,
    description: "Bright apartment with functional layout and parking spot.",
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
