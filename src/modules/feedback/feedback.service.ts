import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AddContactDto } from './dto/add-contact.dto';
import { AddFeedbackDto } from './dto/add-feedback.dto';
import { ContactDto } from './dto/contact.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
import { Contact } from './entities/contact.entity';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async getFeedbacksAsync(limit?: number) {
    const feedbacks = await this.feedbackRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['reviewer'],
      take: limit,
    });

    return feedbacks.map((feedback) =>
      plainToInstance(
        Feedback,
        {
          ...feedback,
          reviewerName: `${feedback.reviewer?.firstName} ${feedback.reviewer?.lastName}`,
          reviewerAvatar: feedback.reviewer?.avatar,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async getMyFeedbacksAsync(context: AuthorizedContext, limit?: number) {
    const feedbacks = await this.feedbackRepository.find({
      where: { reviewerId: context.userId },
      order: { createdAt: 'DESC' },
      relations: ['reviewer'],
      take: limit,
    });

    return feedbacks.map((feedback) =>
      plainToInstance(
        Feedback,
        {
          ...feedback,
          reviewerName: `${feedback.reviewer?.firstName} ${feedback.reviewer?.lastName}`,
          reviewerAvatar: feedback.reviewer?.avatar,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }

  async createFeedbackAsync(
    context: AuthorizedContext,
    addFeedbackDto: AddFeedbackDto,
  ) {
    const feedback = this.feedbackRepository.create({
      ...addFeedbackDto,
      reviewerId: context.userId,
    });
    const newFeedback = await this.feedbackRepository.save(feedback);
    return plainToInstance(Feedback, newFeedback, {
      excludeExtraneousValues: true,
    });
  }

  async updateFeedbackAsync(
    context: AuthorizedContext,
    id: string,
    addFeedbackDto: AddFeedbackDto,
  ) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id, reviewerId: context.userId },
    });
    if (!feedback) {
      throw new BadRequestException(
        'Không tìm thấy phản hồi hoặc bạn không có quyền sửa đổi phản hồi này',
      );
    }

    const updatedFeedback = await this.feedbackRepository.save(addFeedbackDto);
    return plainToInstance(Feedback, updatedFeedback, {
      excludeExtraneousValues: true,
    });
  }

  async toggleFeedbackStatusAsync(id: string) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });
    if (!feedback) {
      throw new BadRequestException('Không tìm thấy phản hồi');
    }
    feedback.isActive = !feedback.isActive;
    const updatedFeedback = await this.feedbackRepository.save(feedback);
    return plainToInstance(Feedback, updatedFeedback, {
      excludeExtraneousValues: true,
    });
  }

  async deleteFeedbackAsync(id: string, context: AuthorizedContext) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new BadRequestException('Không tìm thấy phản hồi');
    }
    if (
      feedback.reviewerId !== context.userId &&
      context.role !== UserRoles.ADMIN
    ) {
      throw new BadRequestException('Bạn không có quyền xóa phản hồi này');
    }
    await this.feedbackRepository.softDelete(id);
    return {
      feedbackId: feedback.id,
    };
  }

  async createContactAsync(addContactDto: AddContactDto) {
    const contact = this.contactRepository.create(addContactDto);
    const newContact = await this.contactRepository.save(contact);

    return plainToInstance(ContactDto, newContact, {
      excludeExtraneousValues: true,
    });
  }

  async getContactsAsync(limit?: number) {
    const contacts = await this.contactRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return contacts.map((contact) =>
      plainToInstance(ContactDto, contact, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async replyContactAsync(contactId: string, replyContactDto: ReplyContactDto) {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId },
    });
    if (!contact) {
      throw new BadRequestException('Không tìm thấy liên hệ này');
    }
    if (contact.isReplied) {
      throw new BadRequestException('Liên hệ này đã được trả lời');
    }

    // Send email to contact

    const updatedContact = await this.contactRepository.save({
      isReplied: true,
    });

    return plainToInstance(ContactDto, updatedContact, {
      excludeExtraneousValues: true,
    });
  }
}
