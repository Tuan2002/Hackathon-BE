import { Auth, RBAC } from '@base/decorators/auth.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddContactDto } from './dto/add-contact.dto';
import { AddFeedbackDto } from './dto/add-feedback.dto';
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
  async getFeedbacks() {
    return this.feedBackService.getFeedbacksAsync();
  }

  @Auth()
  @ApiOperation({ summary: 'Lấy phản hồi của tôi' })
  @Get('my-feedbacks')
  @ApiResponseType(FeedbackDto, { isArray: true })
  async getMyFeedbacks(@UserRequest() context: AuthorizedContext) {
    return this.feedBackService.getMyFeedbacksAsync(context);
  }

  @Auth()
  @ApiOperation({ summary: 'Gửi phản hồi' })
  @Post('create-feedback')
  @ApiResponseType(AddFeedbackDto)
  async createFeedback(
    @Body() addFeedbackDto: AddFeedbackDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.createFeedbackAsync(context, addFeedbackDto);
  }

  @Auth()
  @ApiOperation({ summary: 'Câp nhật phản hồi' })
  @Put('update-feedback/:id')
  @ApiResponseType(FeedbackDto)
  async updateFeedback(
    @Param('id') id: string,
    @Body()
    addFeedbackDto: AddFeedbackDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.updateFeedbackAsync(
      context,
      id,
      addFeedbackDto,
    );
  }

  @Auth()
  @ApiOperation({ summary: 'Xóa phản hồi' })
  @Delete('delete-feedback/:id')
  async deleteFeedback(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.feedBackService.deleteFeedbackAsync(id, context);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Ẩn hiện phản hồi' })
  @Put('toggle-feedback/:id')
  async toggleFeedback(@Param('id') id: string) {
    return this.feedBackService.toggleFeedbackStatusAsync(id);
  }

  @RBAC(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách liên hệ' })
  @Get('contacts')
  @ApiResponseType(ContactDto, { isArray: true })
  async getContacts() {
    return this.feedBackService.getContactsAsync();
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
