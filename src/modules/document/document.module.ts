import { GeminiModule } from '@modules/gemini/gemini.module';
import { PointHistory } from '@modules/user/entities/point-history.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FileModule } from '../s3-file/s3-file.module';
import { DocumentAiService } from './document-ai.service';
import { DocumentCacheService } from './document-cache.service';
import { DocumentChatGateway } from './document-chat.gateway';
import { DocumentCommentService } from './document-comment.service';
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
      User,
      PointHistory,
      Document,
      DocumentComment,
      FavoriteDocument,
      DownloadDocument,
      FavoriteDocument,
    ]),
    S3FileModule,
    GeminiModule,
    UserModule,
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    DocumentFileService,
    DocumentAiService,
    DocumentCacheService,
    DocumentCommentService,
    DocumentChatGateway,
  ],
  exports: [
    DocumentService,
    DocumentFileService,
    DocumentAiService,
    DocumentCacheService,
    DocumentCommentService,
    DocumentChatGateway,
  ],
})
export class DocumentModule {}
