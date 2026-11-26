import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderDto, OrderResponseDto, TicketResponseDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(order: OrderDto): Promise<OrderResponseDto> {
    const items: TicketResponseDto[] = [];
    const places = new Set<string>();

    if (!Array.isArray(order?.tickets) || !order.tickets.length) {
      throw new BadRequestException({ error: 'Нет билетов' });
    }

    for (const ticket of order.tickets) {
      if (!ticket || !ticket.film || !ticket.session) {
        throw new BadRequestException({ error: 'Некорректный билет' });
      }

      const film = await this.filmsRepository.findById(ticket.film);

      if (!film) {
        throw new BadRequestException({ error: 'Фильм не найден' });
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new BadRequestException({ error: 'Сеанс не найден' });
      }

      if (
        !Number.isInteger(ticket.row) ||
        !Number.isInteger(ticket.seat) ||
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException({ error: 'Некорректное место' });
      }

      const place = `${ticket.row}:${ticket.seat}`;
      const key = `${ticket.film}:${ticket.session}:${place}`;

      if (session.taken.includes(place) || places.has(key)) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }

      places.add(key);
    }

    for (const ticket of order.tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const booked = await this.filmsRepository.bookSeat(
        ticket.film,
        ticket.session,
        place,
      );

      if (!booked) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }

      items.push({
        ...ticket,
        id: randomUUID(),
      });
    }

    return {
      total: items.length,
      items,
    };
  }
}
