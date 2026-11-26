import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { FilmSchema } from './film.schema';

@Injectable()
export class FilmsRepository implements OnModuleInit {
  private filmModel = mongoose.model('Film', FilmSchema);

  constructor(@Inject('CONFIG') private readonly config: AppConfig) {}

  async onModuleInit() {
    await mongoose.connect(this.config.database.url);
  }

  async findAll() {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string) {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async bookSeat(filmId: string, sessionId: string, place: string) {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $ne: place },
          },
        },
      },
      {
        $addToSet: {
          'schedule.$.taken': place,
        },
      },
    );

    return result.modifiedCount === 1;
  }
}
