import { FileType } from '@base/enums/file.enum';
import { GeminiService } from '@modules/gemini/gemini.service';
import { S3FileService } from '@modules/s3-file/s3-file.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { DocumentCacheService } from './document-cache.service';
import { DocumentFileService } from './document-file.service';
import { SummaryDocumentDto } from './dto/summery-document.dto';
import { Document } from './entities/document.entity';
import { ChatPrompt } from './enums/chat-prompt.enum';
@Injectable()
export class DocumentAiService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly s3FileService: S3FileService,
    private readonly documentCacheService: DocumentCacheService,
    private readonly documentFileService: DocumentFileService,
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
    const fileBuffer = await this.documentFileService.convertToPdfAsync(
      document.fileKey,
      document.fileName,
      document.fileType,
    );

    const summary = await this.geminiService.generateTextFromDocumentAsync(
      prompt,
      Buffer.from(fileBuffer),
      FileType.PDF,
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

  async generateAudioSummaryAsync(documentId: string) {
    const summary = await this.generateSummaryAsync(documentId);

    if (!summary) {
      throw new NotFoundException('Không tìm thấy nội dung tóm tắt');
    }

    const response = await axios.post(
      `${process.env.TTS_API_URL}/v1/audio/speech`,
      {
        model: 'tts-1',
        input: summary.content,
        voice: 'vi-VN-NamMinhNeural',
        speed: '1.2',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TTS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      },
    );

    if (response.status !== 200) {
      throw new NotFoundException('Không tìm thấy nội dung tóm tắt');
    }

    return Buffer.from(response.data);
  }
}
