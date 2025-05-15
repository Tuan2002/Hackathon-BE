import { GeminiService } from '@modules/gemini/gemini.service';
import { S3FileService } from '@modules/s3-file/s3-file.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { DocumentCacheService } from './document-cache.service';
import { SummaryDocumentDto } from './dto/summery-document.dto';
import { Document } from './entities/document.entity';
import { ChatPrompt } from './enums/chat-prompt.enum';
@Injectable()
export class DocumentAiService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly s3FileService: S3FileService,
    private readonly documentCacheService: DocumentCacheService,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async generateSummaryAsync(documentId: string) {
    const prompt = ChatPrompt.DOCUMENT_SUMMARY;

    // Check if the summary is already cached
    const cachedSummary =
      await this.documentCacheService.getDocumentSummary(documentId);
    if (cachedSummary) {
      return plainToInstance(SummaryDocumentDto, {
        content: cachedSummary,
        documentId: documentId,
      });
    }

    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    // If not cached, generate the summary
    const fileBuffer = await this.s3FileService.getFileStreamAsync(
      document.fileKey,
    );

    const summary = await this.geminiService.generateTextFromDocumentAsync(
      prompt,
      Buffer.from(fileBuffer),
      document.fileType,
    );
    if (summary) {
      // Cache the summary for future use
      await this.documentCacheService.setDocumentSummary(documentId, summary);
    }

    return plainToInstance(SummaryDocumentDto, {
      content: summary,
      documentId: document.id,
    });
  }
}
