import { SecurityOptions } from '@constants';
import { AuthorizedContext } from '@modules/auth/types';
import { S3FileService } from '@modules/s3-file/s3-file.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DownloadDocument } from './entities/download-document.entity';
@Injectable()
export class DocumentFileService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DownloadDocument)
    private downloadDocumentRepository: Repository<DownloadDocument>,
    private readonly s3FileService: S3FileService,
  ) {}

  async getDownloadDocumentUrlAsync(
    context: AuthorizedContext,
    documentId: string,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    const fileKey = document.fileKey;
    const signedUrl = await this.s3FileService.generateSignedUrlAsync(fileKey);
    const downloadDocument = this.downloadDocumentRepository.create({
      documentId: document.id,
      downloadUserId: context.userId,
    });

    await this.downloadDocumentRepository.save(downloadDocument);
    await this.documentRepository.increment(
      { id: documentId },
      'downloadCount',
      1,
    );

    return {
      url: signedUrl,
      expiresAt: dayjs().add(SecurityOptions.FILE_SIGN_TIME, 'second').toDate(),
    };
  }
}
