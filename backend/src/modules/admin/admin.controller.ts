import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('listings')
  getListings() {
    return this.adminService.getListings();
  }

  @Patch('listings/:id')
  updateListing(@Param('id') id: string, @Body() body: { status?: 'Active' | 'Pending' | 'Blocked' }) {
    const status = body?.status;
    if (!status) {
      throw new BadRequestException('status is required.');
    }
    const updated = this.adminService.updateListing(id, { status });
    if (!updated) {
      throw new NotFoundException('Listing not found.');
    }
    return updated;
  }

  @Delete('listings/:id')
  deleteListing(@Param('id') id: string) {
    const ok = this.adminService.deleteListing(id);
    if (!ok) {
      throw new NotFoundException('Listing not found.');
    }
    return { ok: true };
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: { role?: 'User' | 'Admin'; status?: 'Active' | 'Suspended' },
  ) {
    if (!body.role && !body.status) {
      throw new BadRequestException('role or status is required.');
    }
    const updated = this.adminService.updateUser(id, body);
    if (!updated) {
      throw new NotFoundException('User not found.');
    }
    return updated;
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    const ok = this.adminService.deleteUser(id);
    if (!ok) {
      throw new NotFoundException('User not found.');
    }
    return { ok: true };
  }
}
