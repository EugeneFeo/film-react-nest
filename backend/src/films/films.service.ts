import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException('Фильм не найден');
    }

    const items = film.schedule.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: Number(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
