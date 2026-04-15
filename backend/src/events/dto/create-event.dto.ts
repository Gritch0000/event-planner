import { IsString, IsNotEmpty, IsISO8601, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Назва має бути не менше 3 символів' })
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsISO8601() // Перевірка формату дати (наприклад, 2026-04-15)
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}