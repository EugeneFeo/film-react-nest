import { Schema } from 'mongoose';

export const ScheduleSchema = new Schema(
  {
    id: String,
    daytime: String,
    hall: Number,
    rows: Number,
    seats: Number,
    price: Number,
    taken: [String],
  },
  { _id: false },
);

export const FilmSchema = new Schema(
  {
    id: String,
    rating: Number,
    director: String,
    tags: [String],
    image: String,
    cover: String,
    title: String,
    about: String,
    description: String,
    schedule: [ScheduleSchema],
  },
  { collection: 'films' },
);
