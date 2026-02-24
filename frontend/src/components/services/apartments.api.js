// TEMP FAKE API (replace later with real backend fetch)

const fakeApartments = [
  { id: "1", price: 650, meters: 75, description: "Modern apartment near the city center." },
  { id: "2", price: 850, meters: 95, description: "Spacious apartment with natural light." },
  { id: "3", price: 500, meters: 60, description: "Cozy apartment perfect for students." },
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