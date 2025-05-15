import { GeminiModule } from '@modules/gemini/gemini.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FileModule } from '../s3-file/s3-file.module';
import { DocumentAiService } from './document-ai.service';
import { DocumentCacheService } from './document-cache.service';
import { DocumentFileService } from './document-file.service';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentComment } from './entities/document-comment.entity';
import { Document } from './entities/document.entity';
import { DownloadDocument } from './entities/download-document.entity';
import { FavoriteDocument } from './entities/favorite-document.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      DocumentComment,
      FavoriteDocument,
      DownloadDocument,
      FavoriteDocument,
    ]),
    S3FileModule,
    GeminiModule,
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    DocumentFileService,
    DocumentAiService,
    DocumentCacheService,
  ],
  exports: [
    DocumentService,
    DocumentFileService,
    DocumentAiService,
    DocumentCacheService,
  ],
})
export class DocumentModule {}
