import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private events: Event[] = []; 

  findAll() {
    return this.events;
  }

  findOne(id: number) {
    const event = this.events.find(e => e.id === id);
    if (!event) {
      throw new NotFoundException(`Подію з ID ${id} не знайдено`);
    }
    return event;
  }

  create(dto: CreateEventDto) {
    const newEvent: Event = {
      id: this.events.length + 1,
      ...dto
    };
    this.events.push(newEvent);
    return newEvent;
  }

  update(id: number, dto: UpdateEventDto) {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new NotFoundException(`Подію для оновлення не знайдено`);
    }
    this.events[eventIndex] = { ...this.events[eventIndex], ...dto };
    return this.events[eventIndex];
  }

  remove(id: number) {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new NotFoundException(`Подію для видалення не знайдено`);
    }
    this.events.splice(eventIndex, 1);
    return { message: 'Подію успішно видалено' };
  }
}