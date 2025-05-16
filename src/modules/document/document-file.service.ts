import { FileType } from '@base/enums/file.enum';
import { SecurityOptions } from '@constants';
import { AuthorizedContext } from '@modules/auth/types';
import { S3FileService } from '@modules/s3-file/s3-file.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { HttpStatusCode } from 'axios';
import * as dayjs from 'dayjs';
import * as FormData from 'form-data';
import { PDFDocument } from 'pdf-lib';
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

  async getDocumentPreviewAsync(documentId: string) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    const supportedFileTypes = [
      FileType.PDF,
      FileType.WORD_DOCX,
      FileType.WORD_DOC,
      FileType.IMAGE_PNG,
      FileType.IMAGE_JPG,
      FileType.IMAGE_JPEG,
      FileType.TEXT,
    ];
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    if (!document.fileKey || !document.fileType) {
      throw new BadRequestException('Tài liệu không có tệp đính kèm');
    }

    if (!supportedFileTypes.includes(document.fileType)) {
      throw new BadRequestException('Tài liệu không hỗ trợ xem trước');
    }
    // Create a preview PDF
    return this.createPreviewFileAsync(
      document.fileKey,
      document.fileName,
      document.fileType,
    );
  }

  async createPreviewFileAsync(
    fileKey: string,
    fileName: string,
    mimeType: FileType,
  ) {
    try {
      const pdfBuffer = await this.convertToPdfAsync(
        fileKey,
        fileName,
        mimeType,
      );

      if (!pdfBuffer) {
        throw new BadRequestException('Tạo tệp PDF không thành công');
      }

      // Check if the PDF is empty
      // Load the PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const totalPages = pdfDoc.getPageCount();
      const previewPageCount = Math.min(
        SecurityOptions.PDF_PREVIEW_PAGE_LIMIT,
        totalPages,
      );

      // Create a new PDF document for the preview
      const previewDoc = await PDFDocument.create();
      const pages = await previewDoc.copyPages(
        pdfDoc,
        Array.from({ length: previewPageCount }, (_, i) => i),
      );
      pages.forEach((page) => previewDoc.addPage(page));

      // Save the preview PDF
      const previewBytes = await previewDoc.save();
      return Buffer.from(previewBytes);
    } catch (error) {
      console.error('Error creating PDF preview:', error);
      throw new InternalServerErrorException('Failed to create PDF preview');
    }
  }

  public async convertToPdfAsync(
    fileKey: string,
    fileName: string,
    mimeType: FileType,
  ) {
    try {
      if (!fileKey || !fileName || !mimeType) {
        throw new BadRequestException('Invalid file parameters');
      }
      const fileBuffer = await this.s3FileService.getFileStreamAsync(fileKey);

      if (mimeType === FileType.PDF) {
        return Buffer.from(fileBuffer);
      }

      const form = new FormData();
      form.append('fileInput', Buffer.from(fileBuffer), {
        filename: fileName,
        contentType: mimeType,
      });

      const response = await axios.post(
        `${process.env.PDF_CONVERT_API_URL}/api/v1/convert/file/pdf`,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
          responseType: 'arraybuffer',
        },
      );

      if (response.status !== HttpStatusCode.Ok) {
        throw new InternalServerErrorException(
          'Failed to convert file to PDF on remote server',
        );
      }
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error converting file to PDF:', error);
      throw new BadRequestException(
        'Failed to convert file to PDF. Please check the file format.',
      );
    }
  }
}
