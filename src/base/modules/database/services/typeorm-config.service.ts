import { Author } from '@modules/author/entities/author.entity';
import { Category } from '@modules/category/entities/category.entity';
import { DocumentComment } from '@modules/document/entities/document-comment.entity';
import { Document } from '@modules/document/entities/document.entity';
import { DownloadDocument } from '@modules/document/entities/download-document.entity';
import { FavoriteDocument } from '@modules/document/entities/favorite-document.entity';
import { Contact } from '@modules/feedback/entities/contact.entity';
import { Feedback } from '@modules/feedback/entities/feedback.entity';
import { Publisher } from '@modules/publisher/entities/publisher.entity';
import { Banner } from '@modules/system/entities/banner.entity';
import { Config } from '@modules/system/entities/config.entity';
import { PointHistory } from '@modules/user/entities/point-history.entity';
import { Transaction } from '@modules/user/entities/transaction.entity';
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
      entities: [
        User,
        Transaction,
        PointHistory,
        Category,
        Config,
        Banner,
        Publisher,
        Author,
        Document,
        DownloadDocument,
        FavoriteDocument,
        DocumentComment,
        Feedback,
        Contact,
      ],
      namingStrategy: new SnakeNamingStrategy(),
      migrations: ['/migrations/**/*.ts'],
      logging: this.configService.get('NODE_ENV') !== 'production',
    };
  }
}
