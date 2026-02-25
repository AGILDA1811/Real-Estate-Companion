import { apiFetch } from "../../services/apiClient";

export async function fetchApartments() {
  const data = await apiFetch("/listings");
  return Array.isArray(data) ? data : [];
}

export async function fetchApartmentById(id) {
  const data = await apiFetch(`/listings/${id}`);
  return data || null;
}

export async function fetchCompsByApartmentId(id) {
  const data = await apiFetch(`/listings/${id}/comps?limit=5`);
  return Array.isArray(data) ? data : [];
}
