import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @UseGuards(AuthGuard)
  @Get()
  getPayroll(@Req() req) {
    const ownerId = req.user_data.id;
    return this.payrollService.getPayroll(ownerId);
  }
}
