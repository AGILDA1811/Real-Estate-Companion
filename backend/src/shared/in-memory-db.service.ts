import { Injectable } from '@nestjs/common';

export type ListingStatus = 'Active' | 'Pending' | 'Blocked';
export type UserStatus = 'Active' | 'Suspended';
export type UserRole = 'User' | 'Admin';

export type Listing = {
  id: string;
  title: string;
  price: number;
  meters: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  location: string;
  address?: string;
  description: string;
  furnishing?: string;
  hasElevator?: boolean;
  hasTerrace?: boolean;
  hasGarage?: boolean;
  hasParking?: boolean;
  lat?: number;
  lng?: number;
  propertyType?: string;
  propertyStatus?: string;
  status: ListingStatus;
  estimatedPrice: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

@Injectable()
export class InMemoryDbService {
  private listings: Listing[] = [
    {
      id: '1',
      title: 'Modern apartment near center',
      price: 650,
      meters: 75,
      rooms: 2,
      bathrooms: 1,
      floor: 3,
      location: 'Tirana Center',
      description: 'Bright and modern apartment in a central area.',
      status: 'Active',
      estimatedPrice: 730,
    },
    {
      id: '2',
      title: 'Family apartment in Blloku',
      price: 850,
      meters: 95,
      rooms: 3,
      bathrooms: 2,
      floor: 5,
      location: 'Blloku',
      description: 'Spacious apartment close to services and schools.',
      status: 'Pending',
      estimatedPrice: 820,
    },
    {
      id: '3',
      title: 'Compact studio',
      price: 500,
      meters: 60,
      rooms: 1,
      bathrooms: 1,
      floor: 2,
      location: 'Komuna e Parisit',
      description: 'Cozy option for students or first-time buyers.',
      status: 'Blocked',
      estimatedPrice: 580,
    },
  ];

  private users: User[] = [
    {
      id: 'u1',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 'u2',
      name: 'Demo User',
      email: 'user@example.com',
      password: 'user123',
      role: 'User',
      status: 'Active',
    },
  ];

  getListings() {
    return this.listings;
  }

  setListings(next: Listing[]) {
    this.listings = next;
  }

  getUsers() {
    return this.users;
  }

  setUsers(next: User[]) {
    this.users = next;
  }
}
