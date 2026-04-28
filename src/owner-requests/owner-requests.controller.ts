import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Request,
  Patch,
} from '@nestjs/common';
import { OwnerRequestsService } from './owner-requests.service';
import { CreateOwnerRequestDto } from './dto/create-owner-request.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('owner-requests')
export class OwnerRequestsController {
  constructor(private readonly ownerRequestsService: OwnerRequestsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createRequest(@Request() req, @Body() dto: CreateOwnerRequestDto) {
    return this.ownerRequestsService.createRequest(req.user_data, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.ownerRequestsService.findAll();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.ownerRequestsService.approveRequest(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.ownerRequestsService.rejectRequest(Number(id));
  }
}
