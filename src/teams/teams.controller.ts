import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateTeamDto, @Req() req) {
    const userId = req.user_data.id;
    return this.teamsService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('my-team')
  getMyTeam(@Req() req) {
    const ownerId = req.user_data.id;
    return this.teamsService.getMyTeam(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
