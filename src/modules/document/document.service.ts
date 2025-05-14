import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BaseDocumentDto } from './dto/base-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PublicDocumentDto } from './dto/public-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { DocumentStatus } from './enums/document-status.enum';
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async createDocumentAsync(
    context: AuthorizedContext,
    createDocumentDto: CreateDocumentDto,
  ) {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      ownerId: context.userId,
    });
    const createdDocument = await this.documentRepository.save(document);
    return plainToInstance(
      BaseDocumentDto,
      {
        ...createdDocument,
        categoryName: createdDocument?.category?.name,
        authorName: createdDocument?.author?.name,
        publisherName: createdDocument?.publisher?.name,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getDocumentsByOwnerIdAsync(context: AuthorizedContext) {
    const documents = await this.documentRepository.find({
      where: { ownerId: context.userId },
    });
    return documents.map((document) =>
      plainToInstance(
        PublicDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          publisherName: document?.publisher?.name,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getPublicDocumentsAsync() {
    const rawDocuments = await this.documentRepository.find({
      where: {
        status: DocumentStatus.APPROVED,
        isActive: true,
      },
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });
    return rawDocuments.map((document) =>
      plainToInstance(
        BaseDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          publisherName: document?.publisher?.name,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getAllDocumentsAsync() {
    const documents = await this.documentRepository.find({
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });
    return documents.map((document) =>
      plainToInstance(
        PublicDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          publisherName: document?.publisher?.name,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getDocumentByIdAsync(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['category', 'author', 'publisher'],
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    return plainToInstance(PublicDocumentDto, document, {
      excludeExtraneousValues: true,
    });
  }

  async getDocumentBySlugAsync(slug: string) {
    const document = await this.documentRepository.findOne({
      where: { slug },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    await this.documentRepository.increment(
      { id: document.id },
      'viewCount',
      1,
    );

    return plainToInstance(PublicDocumentDto, document, {
      excludeExtraneousValues: true,
    });
  }

  async updateDocumentAsync(
    context: AuthorizedContext,
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    if (
      document.ownerId !== context.userId ||
      context.role !== UserRoles.ADMIN
    ) {
      throw new ForbiddenException('Bạn không có quyền cập nhật tài liệu này');
    }
    const updatedDocument = await this.documentRepository.save({
      ...document,
      ...updateDocumentDto,
    });
    return plainToInstance(
      PublicDocumentDto,
      {
        ...updatedDocument,
        categoryName: updatedDocument?.category?.name,
        authorName: updatedDocument?.author?.name,
        publisherName: updatedDocument?.publisher?.name,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteDocumentAsync(context: AuthorizedContext, id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    if (
      document.ownerId !== context.userId ||
      context.role !== UserRoles.ADMIN
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa tài liệu này');
    }
    await this.documentRepository.softDelete(id);
    return {
      documentId: document.id,
    };
  }

  async approveDocumentAsync(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    await this.documentRepository.update(id, {
      status: DocumentStatus.APPROVED,
    });
    return {
      documentId: document.id,
      status: DocumentStatus.APPROVED,
    };
  }

  async rejectDocumentAsync(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    await this.documentRepository.update(id, {
      status: DocumentStatus.REJECTED,
    });
    return {
      documentId: document.id,
      status: DocumentStatus.REJECTED,
    };
  }

  async toggleDocumentActiveAsync(context: AuthorizedContext, id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    if (document.ownerId !== context.userId) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác với tài liệu này',
      );
    }

    if (document.status === DocumentStatus.BLOCKED) {
      throw new ForbiddenException('Tài liệu đã bị khóa');
    }

    await this.documentRepository.update(id, {
      isActive: !document.isActive,
    });

    return {
      documentId: document.id,
      isActive: !document.isActive,
    };
  }

  async toggleBlockDocumentAsync(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    await this.documentRepository.update(id, {
      status:
        document.status === DocumentStatus.BLOCKED
          ? DocumentStatus.APPROVED
          : DocumentStatus.BLOCKED,
      isActive: false,
    });
    return {
      documentId: document.id,
      status:
        document.status === DocumentStatus.BLOCKED
          ? DocumentStatus.APPROVED
          : DocumentStatus.BLOCKED,
    };
  }

  async getDocumentByCategoryIdAsync(categoryId: string) {
    const documents = await this.documentRepository.find({
      where: { categoryId },
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });
    return documents.map((document) =>
      plainToInstance(PublicDocumentDto, document, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getDocumentByAuthorIdAsync(authorId: string) {
    const documents = await this.documentRepository.find({
      where: { authorId },
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });
    return documents.map((document) =>
      plainToInstance(PublicDocumentDto, document, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
