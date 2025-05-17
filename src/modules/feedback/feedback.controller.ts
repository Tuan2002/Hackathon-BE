import { RBAC } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddContactDto } from './dto/add-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { ReplyContactDto } from './dto/reply-contact.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedBackService: FeedbackService) {}

  @ApiOperation({ summary: 'Lấy danh sách phản hồi' })
  @Get('feedbacks')
  @ApiResponseType(FeedbackDto, { isArray: true })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng phản hồi tối đa',
    type: Number,
  })
  async getFeedbacks(@Query() limit?: number) {
    return this.feedBackService.getFeedbacksAsync(limit);
  }

  @ApiOperation({ summary: 'Lấy phản hồi của tôi' })
  @Get('my-feedbacks')
  @ApiResponseType(FeedbackDto, { isArray: true })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng phản hồi tối đa',
    type: Number,
  })
  async getMyFeedbacks(
    @UserRequest() context: AuthorizedContext,
    @Query() limit?: number,
  ) {
    return this.feedBackService.getMyFeedbacksAsync(context, limit);
  }

  @RBAC(UserRoles.NORMAL_USER)
  @ApiOperation({ summary: 'Gửi phản hồi' })
  @Post('create-feedback')
  @ApiResponseType(FeedbackDto)
  async createFeedback(
    @Body() addFeedbackDto: FeedbackDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.createFeedbackAsync(context, addFeedbackDto);
  }

  @RBAC(UserRoles.NORMAL_USER)
  @ApiOperation({ summary: 'Câp nhật phản hồi' })
  @Put('update-feedback/:id')
  @ApiResponseType(FeedbackDto)
  async updateFeedback(
    @Param('id') id: string,
    @Body()
    addFeedbackDto: FeedbackDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.updateFeedbackAsync(
      context,
      id,
      addFeedbackDto,
    );
  }

  @RBAC(UserRoles.NORMAL_USER, UserRoles.ADMIN)
  @ApiOperation({ summary: 'Xóa phản hồi' })
  @Put('delete-feedback/:id')
  @ApiResponseType(FeedbackDto)
  async deleteFeedback(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.deleteFeedbackAsync(id, context);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Ẩn hiện phản hồi' })
  @Put('toggle-feedback/:id')
  @ApiResponseType(FeedbackDto)
  async toggleFeedback(@Param('id') id: string) {
    return this.feedBackService.toggleFeedbackStatusAsync(id);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách liên hệ' })
  @Get('contacts')
  @ApiResponseType(ContactDto, { isArray: true })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng liên hệ tối đa',
    type: Number,
  })
  async getContacts(@Query() limit?: number) {
    return this.feedBackService.getContactsAsync(limit);
  }

  @ApiOperation({ summary: 'Gửi liên hệ' })
  @Post('create-contact')
  @ApiResponseType(ContactDto)
  async createContact(@Body() addContactDto: AddContactDto) {
    return this.feedBackService.createContactAsync(addContactDto);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Trả lời liên hệ' })
  @Put('reply-contact/:id')
  @ApiResponseType(ContactDto)
  async replyContact(
    @Param('id') id: string,
    @Body() replyContactDto: ReplyContactDto,
  ) {
    return this.feedBackService.replyContactAsync(id, replyContactDto);
  }
}
