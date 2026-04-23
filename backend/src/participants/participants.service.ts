import { Injectable } from '@nestjs/common';

export interface Participant {
  id: number;
  name: string;
  email: string;
  eventId: number;
}

@Injectable()
export class ParticipantsService {
  
  private participants: Participant[] = [];

  create(eventId: number, name: string, email: string) {
    const newParticipant = {
      id: Date.now(),
      name,
      email,
      eventId: Number(eventId),
    };
    this.participants.push(newParticipant);
    return newParticipant;
  }

  
  findAllByEvent(eventId: number) {
    return this.participants.filter(p => p.eventId === Number(eventId));
  }

  remove(id: number) {
    this.participants = this.participants.filter(p => p.id !== Number(id));
    return { deleted: true };
  }
}