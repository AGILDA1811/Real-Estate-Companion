import { Injectable } from '@nestjs/common';
import { InMemoryDbService, ListingStatus, UserRole, UserStatus } from '../../shared/in-memory-db.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: InMemoryDbService) {}

  getStats() {
    const listings = this.db.getListings();
    const users = this.db.getUsers();
    const goodDeals = listings.filter((l) => l.price < l.estimatedPrice).length;
    const activeListings = listings.filter((l) => l.status === 'Active').length;

    return [
      { id: 'totalListings', label: 'Total Listings', value: listings.length, indicator: 80 },
      { id: 'totalUsers', label: 'Total Users', value: users.length, indicator: 70 },
      { id: 'totalGoodDeals', label: 'Total Good Deals', value: goodDeals, indicator: 64 },
      { id: 'activeListings', label: 'Active Listings', value: activeListings, indicator: 85 },
    ];
  }

  getListings() {
    return this.db.getListings();
  }

  updateListing(id: string, payload: Partial<{ status: ListingStatus }>) {
    const listings = this.db.getListings();
    const updated = listings.map((listing) =>
      listing.id === id && payload.status ? { ...listing, status: payload.status } : listing,
    );
    const found = updated.find((listing) => listing.id === id);
    if (!found) return null;
    this.db.setListings(updated);
    return found;
  }

  deleteListing(id: string) {
    const listings = this.db.getListings();
    const exists = listings.some((l) => l.id === id);
    if (!exists) return false;
    this.db.setListings(listings.filter((l) => l.id !== id));
    return true;
  }

  getUsers() {
    return this.db.getUsers().map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }));
  }

  updateUser(id: string, payload: Partial<{ role: UserRole; status: UserStatus }>) {
    const users = this.db.getUsers();
    const updated = users.map((user) => {
      if (user.id !== id) return user;
      return {
        ...user,
        role: payload.role || user.role,
        status: payload.status || user.status,
      };
    });
    const found = updated.find((user) => user.id === id);
    if (!found) return null;
    this.db.setUsers(updated);
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      status: found.status,
    };
  }

  deleteUser(id: string) {
    const users = this.db.getUsers();
    const exists = users.some((u) => u.id === id);
    if (!exists) return false;
    this.db.setUsers(users.filter((u) => u.id !== id));
    return true;
  }
}
