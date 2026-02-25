import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InMemoryDbService } from '../../shared/in-memory-db.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: InMemoryDbService) {}

  signup(fullName: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.db.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return { ok: false, message: 'User already exists.' };
    }

    const newUser = {
      id: `u${Date.now()}`,
      name: fullName.trim(),
      email: normalizedEmail,
      password,
      role: 'User' as const,
      status: 'Active' as const,
    };
    this.db.setUsers([...users, newUser]);
    return { ok: true, message: 'User created successfully.' };
  }

  login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.db
      .getUsers()
      .find((u) => u.email.toLowerCase() === normalizedEmail && u.password === password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if (user.status !== 'Active') {
      throw new UnauthorizedException('User is suspended.');
    }

    return {
      token: `mock-token-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
