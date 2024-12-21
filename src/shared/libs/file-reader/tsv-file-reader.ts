import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { RentalOffer, City, RentalType, RentalAmenities, UserType } from '../../types/index.js';
export class TSVFileReader implements FileReader {
  private rawData = '';
  constructor(
    private readonly filename: string
  ) {}
  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }
  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, info, date, city, preview, photos, premium, favorite, rating, type, rooms, guests, price, amenities, name, email, avatar, password, userType, coordinates]) => ({
        title,
        info,
        date: new Date(date),
        city: city as City,
        preview,
        photos: photos.split(';'),
        premium: premium.toLowerCase() === 'true',
        favorite: favorite.toLowerCase() === 'true',
        rating: Number.parseInt(rating, 10),
        type: type as RentalType,
        rooms: Number.parseInt(rooms, 10),
        guests: Number.parseInt(guests, 10),
        price: Number.parseInt(price, 10),
        amenities: amenities
          .split(';')
          .map((amenity) => amenity as RentalAmenities),
        renter: {
          name,
          email,
          avatar,
          password,
          type: userType as UserType
        },
        countComments: 0,
        coordinates: coordinates.split(';').map((coordinate) => Number.parseFloat(coordinate)),
      }));
  }
}
