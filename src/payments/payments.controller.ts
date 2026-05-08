import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    createPayment(@Req() req, @Body() dto: CreatePaymentDto) {
        return this.paymentsService.createPayment(req.user_data.id, dto);
    }

    @UseGuards(AuthGuard)
    @Get('member/:teamMemberId')
    getPaymentHistory(@Req() req, @Param('teamMemberId', ParseIntPipe) teamMemberId: number) {
        return this.paymentsService.getPaymentHistory(req.user_data.id, teamMemberId);
    }
}
