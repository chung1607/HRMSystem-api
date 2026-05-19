import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OwnerSubscriptionsService } from './owner-subscriptions.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOwnerSubscriptionDto } from './dto/create-owner-subscription.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from 'helpers/config';

@Controller('owner-subscriptions')
export class OwnerSubscriptionsController {
  constructor(
    private readonly ownerSubscriptionsService: OwnerSubscriptionsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateOwnerSubscriptionDto) {
    return this.ownerSubscriptionsService.create(req.user_data.id, dto);
  }

  @UseGuards(AuthGuard)
  @Post(':id/upload-proof')
  @UseInterceptors(
    FileInterceptor('proof', {
      storage: storageConfig('subscriptions'),
      fileFilter: (req: any, file, cb) => {
        const ext = extname(file.originalname);

        const allowedExts = ['.jpg', '.jpeg', '.png'];

        if (!allowedExts.includes(ext)) {
          req.fileValidationError = `Only image files are allowed: ${allowedExts.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);

          if (fileSize > 5 * 1024 * 1024) {
            req.fileValidationError = 'File size exceeds the limit of 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadProof(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.ownerSubscriptionsService.uploadProof(
      req.user_data.id,
      id,
      file.destination + '/' + file.filename,
    );
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard)
  approveSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.ownerSubscriptionsService.approveSubscription(id);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard)
  rejectSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.ownerSubscriptionsService.rejectSubscription(id);
  }

  @UseGuards(AuthGuard)
  @Get('status')
  getSubscriptionStatus(@Query('status') status: 'all' | 'paid' | 'unpaid') {
    return this.ownerSubscriptionsService.getSubscriptionStatus(
      status || 'all',
    );
  }

  @Get('dashboard-unpaid')
  @UseGuards(AuthGuard)
  getUnpaidOwnersStats() {
    return this.ownerSubscriptionsService.getUnpaidOwnersStats();
  }
}
