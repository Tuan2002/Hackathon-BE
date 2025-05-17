import { AuthorizedContext } from '@modules/auth/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BaseCommentDto } from './dto/base-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DocumentComment } from './entities/document-comment.entity';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentCommentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentComment)
    private readonly documentCommentRepository: Repository<DocumentComment>,
  ) {}

  async createCommentAsync(
    context: AuthorizedContext,
    documentId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const comment = this.documentCommentRepository.create({
      ...createCommentDto,
      documentId: document.id,
      commenterId: context.userId,
    });

    const savedComment = await this.documentCommentRepository.save(comment, {
      reload: true,
    });

    // If you need the commenter relation, fetch it explicitly
    const newComment = await this.documentCommentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['commenter'],
    });

    return plainToInstance(
      BaseCommentDto,
      {
        ...newComment,
        commenterName: `${newComment?.commenter?.firstName} ${newComment?.commenter?.lastName}`,
        commenterImage: newComment?.commenter?.avatar,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async updateCommentAsync(
    context: AuthorizedContext,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.documentCommentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại');
    }

    if (comment.commenterId !== context.userId) {
      throw new NotFoundException('Bạn không có quyền sửa bình luận này');
    }

    await this.documentCommentRepository.update(commentId, updateCommentDto);
    const updatedComment = await this.documentCommentRepository.findOne({
      where: { id: commentId },
      relations: ['commenter'],
    });

    return plainToInstance(
      BaseCommentDto,
      {
        ...updatedComment,
        commenterName: `${updatedComment?.commenter?.firstName} ${updatedComment?.commenter?.lastName}`,
        commenterImage: updatedComment?.commenter?.avatar,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deleteCommentAsync(context: AuthorizedContext, commentId: string) {
    const comment = await this.documentCommentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại');
    }

    if (comment.commenterId !== context.userId) {
      throw new NotFoundException('Bạn không có quyền xóa bình luận này');
    }

    await this.documentCommentRepository.softDelete(commentId);

    return {
      commentId: commentId,
    };
  }

  async replyCommentAsync(
    context: AuthorizedContext,
    commentId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const parentComment = await this.documentCommentRepository.findOne({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    const replyComment = this.documentCommentRepository.create({
      ...createCommentDto,
      documentId: parentComment.documentId,
      commenterId: context.userId,
      parentId: parentComment.id,
    });

    const savedReplyComment =
      await this.documentCommentRepository.save(replyComment);

    const newReplyComment = await this.documentCommentRepository.findOne({
      where: { id: savedReplyComment.id },
      relations: ['commenter'],
    });

    return plainToInstance(
      BaseCommentDto,
      {
        ...newReplyComment,
        commenterName: `${savedReplyComment?.commenter?.firstName} ${savedReplyComment?.commenter?.lastName}`,
        commenterImage: savedReplyComment?.commenter?.avatar,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getCommentsByDocumentIdAsync(documentId: string) {
    const comments = await this.documentCommentRepository.find({
      where: { documentId },
      relations: ['commenter'],
    });

    return comments.map((comment) =>
      plainToInstance(
        BaseCommentDto,
        {
          ...comment,
          commenterName: `${comment?.commenter?.firstName} ${comment?.commenter?.lastName}`,
          commenterImage: comment?.commenter?.avatar,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }
}
