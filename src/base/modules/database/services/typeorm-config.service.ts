import { Category } from '@modules/category/entities/category.entity';
import { User } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('POSTGRES_HOST'),
      port: +this.configService.getOrThrow<string>('POSTGRES_PORT'),
      username: this.configService.getOrThrow<string>('POSTGRES_USER'),
      password: this.configService.getOrThrow<string>('POSTGRES_PASSWORD'),
      database: this.configService.getOrThrow<string>('POSTGRES_DATABASE'),
      synchronize: false,
      entities: [User, Category],
      namingStrategy: new SnakeNamingStrategy(),
      migrations: ['/migrations/**/*.ts'],
      logging: this.configService.get('NODE_ENV') !== 'production',
    };
  }
}
