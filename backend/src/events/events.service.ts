import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  // Наш масив-база даних
  private events: Event[] = [
    { id: 1, title: 'Мітап програмістів', description: 'Обговорення Nest.js', date: '2026-05-20', location: 'Київ' }
  ];

  // Метод для отримання всіх подій
  findAll() {
    return this.events;
  }

  // Метод для створення нової події
  create(newEvent: Event) {
    const id = this.events.length + 1; // Проста генерація ID
    const event = { ...newEvent, id };
    this.events.push(event);
    return event;
  }
}