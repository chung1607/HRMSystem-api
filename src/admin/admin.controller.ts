import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Patch('users/:id/disable')
  disableUser(@Param('id') id: string) {
    return this.adminService.disableUser(Number(id));
  }

  @Patch('users/:id/enable')
  enableUser(@Param('id') id: string) {
    return this.adminService.enableUser(Number(id));
  }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    return this.adminService.updateUserRole(Number(id), body.role);
  }
}
