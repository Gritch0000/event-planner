import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ParticipantsService } from './participants.service';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  create(@Body() body: { eventId: number; name: string; email: string }) {
    return this.participantsService.create(body.eventId, body.name, body.email);
  }

  
  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.participantsService.findAllByEvent(+eventId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id);
  }
}