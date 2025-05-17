import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { BaseDocumentDto } from './dto/base-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DownloadedDocumentDto } from './dto/downloaded-document.dto';
import { PublicDocumentDto } from './dto/public-document.dto';
import { RejectDocumentDto } from './dto/reject-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { DownloadDocument } from './entities/download-document.entity';
import { FavoriteDocument } from './entities/favorite-document.entity';
import { DocumentStatus } from './enums/document-status.enum';
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(FavoriteDocument)
    private favoriteDocumentRepository: Repository<FavoriteDocument>,
    @InjectRepository(DownloadDocument)
    private downloadDocumentRepository: Repository<DownloadDocument>,
  ) {}

  async createDocumentAsync(
    context: AuthorizedContext,
    createDocumentDto: CreateDocumentDto,
  ) {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      ownerId: context.userId,
      status:
        context.role === UserRoles.ADMIN
          ? DocumentStatus.APPROVED
          : DocumentStatus.PENDING,
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
      relations: ['category', 'author', 'publisher', 'favoriteDocuments'],
    });
    return documents.map((document) =>
      plainToInstance(
        PublicDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
          isFavorite: false,
          favoriteCount: document?.favoriteDocuments?.length || 0,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getPublicDocumentsAsync(
    context?: AuthorizedContext,
    categoryId?: string,
    authorId?: string,
  ) {
    const documents = await this.documentRepository.find({
      where: {
        status: DocumentStatus.APPROVED,
        isActive: true,
        categoryId,
        authorId,
      },
      relations: ['category', 'author', 'publisher', 'favoriteDocuments'],
      order: {
        createdAt: 'DESC',
      },
    });
    if (context) {
      const favoriteDocumentIds = await this.favoriteDocumentRepository.find({
        where: { userId: context.userId },
        select: ['documentId'],
      });

      const mappedFavoriteDocuments = new Map(
        favoriteDocumentIds.map((doc) => [doc.documentId, doc.documentId]),
      );

      return documents.map((document) =>
        plainToInstance(
          BaseDocumentDto,
          {
            ...document,
            categoryName: document?.category?.name,
            authorName: document?.author?.name,
            categorySlug: document?.category?.slug,
            publisherName: document?.publisher?.name,
            isFavorite: mappedFavoriteDocuments.has(document.id),
            favoriteCount: document?.favoriteDocuments?.length || 0,
          },
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    }
    return documents.map((document) =>
      plainToInstance(
        BaseDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
          isFavorite: false,
          favoriteCount: document?.favoriteDocuments?.length || 0,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getAllDocumentsAsync() {
    const documents = await this.documentRepository.find({
      relations: ['category', 'author', 'publisher', 'favoriteDocuments'],
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
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
          favoriteCount: document?.favoriteDocuments?.length || 0,
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
      relations: ['category', 'author', 'publisher', 'favoriteDocuments'],
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    return plainToInstance(
      PublicDocumentDto,
      {
        ...document,
        categoryName: document?.category?.name,
        authorName: document?.author?.name,
        categorySlug: document?.category?.slug,
        publisherName: document?.publisher?.name,
        favoriteCount: document?.favoriteDocuments?.length || 0,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getDocumentBySlugAsync(slug: string, context?: AuthorizedContext) {
    const document = await this.documentRepository.findOne({
      where: { slug },
      relations: ['category', 'author', 'publisher', 'favoriteDocuments'],
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    let isFavorite = false;
    if (context) {
      isFavorite = await this.favoriteDocumentRepository.exists({
        where: {
          userId: context.userId,
          documentId: document.id,
        },
      });
    }
    await this.documentRepository.increment(
      { id: document.id },
      'viewCount',
      1,
    );

    return plainToInstance(
      PublicDocumentDto,
      {
        ...document,
        categoryName: document?.category?.name,
        authorName: document?.author?.name,
        publisherName: document?.publisher?.name,
        isFavorite: isFavorite,
        favoriteCount: document?.favoriteDocuments?.length || 0,
      },
      {
        excludeExtraneousValues: true,
      },
    );
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
        categorySlug: updatedDocument?.category?.slug,
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

  async rejectDocumentAsync(id: string, rejectDocumentDto: RejectDocumentDto) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }
    await this.documentRepository.update(id, {
      status: DocumentStatus.REJECTED,
      rejectedReason: rejectDocumentDto.reason,
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

  async toggleFavoriteDocumentAsync(
    context: AuthorizedContext,
    documentId: string,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    const favoriteDocument = await this.favoriteDocumentRepository.findOne({
      where: {
        userId: context.userId,
        documentId,
      },
    });
    if (favoriteDocument) {
      await this.favoriteDocumentRepository.delete(favoriteDocument.id);
      return {
        documentId: document.id,
        isFavorite: false,
      };
    }
    await this.favoriteDocumentRepository.save({
      userId: context.userId,
      documentId,
    });
    return {
      documentId: document.id,
      isFavorite: true,
    };
  }

  async getFavoriteDocumentsAsync(context: AuthorizedContext) {
    const favoriteDocumentIds = await this.favoriteDocumentRepository.find({
      where: { userId: context.userId },
      select: ['documentId'],
    });

    const documents = await this.documentRepository.find({
      where: {
        id: In(favoriteDocumentIds.map((doc) => doc.documentId)),
        status: DocumentStatus.APPROVED,
        isActive: true,
      },
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
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getDownloadedDocumentsAsync(context: AuthorizedContext) {
    const downloadedDocuments = await this.downloadDocumentRepository.find({
      where: { downloadUserId: context.userId },
      select: ['documentId', 'downloadedAt'],
    });

    const documents = await this.documentRepository.find({
      where: {
        id: In(downloadedDocuments.map((doc) => doc.documentId)),
        status: DocumentStatus.APPROVED,
        isActive: true,
      },
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });

    const mappedDownloadedDocuments = new Map(
      downloadedDocuments.map((doc) => [doc.documentId, doc]),
    );
    return documents.map((document) =>
      plainToInstance(
        PublicDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
          downloadedAt: mappedDownloadedDocuments.get(document.id)
            ?.downloadedAt,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getAllDownloadedDocumentsAsync() {
    const downloadedDocuments = await this.downloadDocumentRepository.find({
      relations: ['downloadUser', 'downloadAt'],
      select: ['documentId', 'downloadedAt', 'downloadUser'],
    });

    const documents = await this.documentRepository.find({
      where: {
        id: In(downloadedDocuments.map((doc) => doc.documentId)),
        status: DocumentStatus.APPROVED,
        isActive: true,
      },
      relations: ['category', 'author', 'publisher'],
      order: {
        createdAt: 'DESC',
      },
    });

    const mappedDownloadedDocuments = new Map(
      downloadedDocuments.map((doc) => [doc.documentId, doc]),
    );

    return documents.map((document) =>
      plainToInstance(
        DownloadedDocumentDto,
        {
          ...document,
          categoryName: document?.category?.name,
          authorName: document?.author?.name,
          categorySlug: document?.category?.slug,
          publisherName: document?.publisher?.name,
          downloadedAt: mappedDownloadedDocuments.get(document.id)
            ?.downloadedAt,
          downloadedBy: `${mappedDownloadedDocuments.get(document.id)?.downloadUser.firstName} ${mappedDownloadedDocuments.get(document.id)?.downloadUser?.lastName}`,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }
}
