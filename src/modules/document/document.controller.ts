import { Auth, RBAC } from '@base/decorators/auth.decorator';
import { FilesUpload } from '@base/decorators/files.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { FileType } from '@base/enums/file.enum';
import { StorageFolders } from '@base/enums/storage-folder.enum';
import { StoragePermission } from '@base/enums/storage-permission.enum';
import { AuthorizedContext } from '@modules/auth/types';
import { UserRoles } from '@modules/user/enums/roles.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { DocumentAiService } from './document-ai.service';
import { DocumentCommentService } from './document-comment.service';
import { DocumentFileService } from './document-file.service';
import { DocumentService } from './document.service';
import { BaseCommentDto } from './dto/base-comment.dto';
import { BaseDocumentDto } from './dto/base-document.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentAnalystDto } from './dto/document-analyst.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { DownloadedDocumentDto } from './dto/downloaded-document.dto';
import { FileUploadDto, FileUploadResponseDto } from './dto/file-upload.dto';
import { PublicDocumentDto } from './dto/public-document.dto';
import { RejectDocumentDto } from './dto/reject-document.dto';
import { SummaryDocumentDto } from './dto/summery-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly documentFileService: DocumentFileService,
    private readonly documentAiService: DocumentAiService,
    private readonly documentCommentService: DocumentCommentService,
  ) {}

  @RBAC(UserRoles.ADMIN, UserRoles.NORMAL_USER)
  @Post('upload-document')
  @ApiOperation({ summary: 'Tải lên tài liệu' })
  @ApiResponseType(FileUploadResponseDto)
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @FilesUpload(
    StorageFolders.DOCUMENTS,
    [FileType.PDF, FileType.WORD_DOCX],
    StoragePermission.PRIVATE,
  )
  async uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return plainToInstance(FileUploadResponseDto, file, {
      excludeExtraneousValues: true,
    });
  }

  @Auth()
  @Get('get-my-documents')
  @ApiResponseType(PublicDocumentDto)
  @ApiOperation({ summary: 'Lấy danh sách tài liệu của người dùng' })
  async getMyDocuments(@UserRequest() context: AuthorizedContext) {
    return this.documentService.getDocumentsByOwnerIdAsync(context);
  }

  @Get('get-public-documents')
  @ApiOperation({ summary: 'Lấy danh sách tài liệu công khai' })
  @ApiResponseType(BaseDocumentDto)
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID của danh mục tài liệu',
    type: String,
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'ID của tác giả tài liệu',
    type: String,
  })
  async getPublicDocuments(
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @UserRequest() context?: AuthorizedContext,
  ) {
    return this.documentService.getPublicDocumentsAsync(
      context,
      categoryId,
      authorId,
    );
  }

  @Auth()
  @Get('get-auth-documents')
  @ApiOperation({ summary: 'Lấy danh sách tài liệu sau khi đã đăng nhập' })
  @ApiResponseType(BaseDocumentDto)
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID của danh mục tài liệu',
    type: String,
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'ID của tác giả tài liệu',
    type: String,
  })
  async getAuthDocuments(
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @UserRequest() context?: AuthorizedContext,
  ) {
    return this.documentService.getPublicDocumentsAsync(
      context,
      categoryId,
      authorId,
    );
  }

  @RBAC(UserRoles.ADMIN)
  @Get('get-documents')
  @ApiOperation({ summary: 'Lấy danh sách tài liệu' })
  @ApiResponseType(PublicDocumentDto)
  async getAllDocuments() {
    return this.documentService.getAllDocumentsAsync();
  }

  @RBAC(UserRoles.ADMIN, UserRoles.NORMAL_USER)
  @Post('create-document')
  @ApiOperation({ summary: 'Tạo tài liệu' })
  @ApiResponseType(PublicDocumentDto)
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentService.createDocumentAsync(context, createDocumentDto);
  }

  @RBAC(UserRoles.ADMIN, UserRoles.NORMAL_USER)
  @Get('get-by-id/:id')
  @ApiOperation({ summary: 'Lấy tài liệu theo id' })
  @ApiResponseType(PublicDocumentDto)
  async getDocumentById(@Param('id') id: string) {
    return this.documentService.getDocumentByIdAsync(id);
  }

  @Get('get-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy tài liệu theo slug' })
  @ApiResponseType(PublicDocumentDto)
  async getDocumentBySlug(
    @Param('slug') slug: string,
    @UserRequest() context?: AuthorizedContext,
  ) {
    return this.documentService.getDocumentBySlugAsync(slug, context);
  }

  @Auth()
  @Get('auth-get-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy tài liệu theo slug sau khi đã đăng nhập' })
  @ApiResponseType(PublicDocumentDto)
  async getAuthDocumentBySlug(
    @Param('slug') slug: string,
    @UserRequest() context?: AuthorizedContext,
  ) {
    return this.documentService.getDocumentBySlugAsync(slug, context);
  }

  @Auth()
  @Put('update-document/:id')
  @ApiOperation({ summary: 'Cập nhật tài liệu' })
  @ApiResponseType(PublicDocumentDto)
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentService.updateDocumentAsync(
      context,
      id,
      updateDocumentDto,
    );
  }

  @RBAC(UserRoles.ADMIN, UserRoles.NORMAL_USER)
  @Delete('delete-document/:id')
  @ApiOperation({ summary: 'Xóa tài liệu' })
  async deleteDocument(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentService.deleteDocumentAsync(context, id);
  }

  @RBAC(UserRoles.ADMIN)
  @Patch('approve-document/:id')
  @ApiOperation({ summary: 'Phê duyệt tài liệu' })
  async approveDocument(@Param('id') id: string) {
    return this.documentService.approveDocumentAsync(id);
  }

  @RBAC(UserRoles.ADMIN)
  @Patch('reject-document/:id')
  @ApiOperation({ summary: 'Từ chối tài liệu' })
  async rejectDocument(
    @Param('id') id: string,
    @Body() rejectDocumentDto: RejectDocumentDto,
  ) {
    return this.documentService.rejectDocumentAsync(id, rejectDocumentDto);
  }

  @RBAC(UserRoles.ADMIN)
  @Patch('toggle-block/:id')
  @ApiOperation({ summary: 'Khóa/Mở khóa tài liệu' })
  async toggleBlockDocument(@Param('id') id: string) {
    return this.documentService.toggleBlockDocumentAsync(id);
  }

  @RBAC(UserRoles.ADMIN, UserRoles.NORMAL_USER)
  @Patch('toggle-active/:id')
  @ApiOperation({ summary: 'Ẩn/Hiện tài liệu' })
  async toggleActiveDocument(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentService.toggleDocumentActiveAsync(context, id);
  }

  @Auth()
  @Get('get-download-url/:id')
  @ApiOperation({ summary: 'Lấy link tải tài liệu' })
  @ApiResponseType(DownloadFileDto)
  async getDownloadDocumentUrl(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentFileService.getDownloadDocumentUrlAsync(context, id);
  }

  @Auth()
  @Get('get-document-preview/:id')
  @ApiOperation({ summary: 'Lấy tài liệu xem trước' })
  async getDocumentPreview(@Param('id') id: string, @Res() res: Response) {
    const fileBuffer =
      await this.documentFileService.getDocumentPreviewAsync(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=preview.pdf');
    res.send(fileBuffer);
  }

  @Auth()
  @Get('generate-summary/:id')
  @ApiOperation({ summary: 'Tạo tóm tắt tài liệu văn bản' })
  @ApiResponseType(SummaryDocumentDto)
  async generateSummary(@Param('id') id: string) {
    return this.documentAiService.generateSummaryAsync(id);
  }

  @Auth()
  @Get('generate-audio-summary/:id')
  @ApiOperation({ summary: 'Tạo tóm tắt tài liệu âm thanh' })
  async generateAudioSummary(@Param('id') id: string, @Res() res: Response) {
    const audioBuffer =
      await this.documentAiService.generateAudioSummaryAsync(id);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename=summary.buffer');
    res.send(audioBuffer);
  }

  @Auth()
  @Get('get-favorite-documents')
  @ApiOperation({ summary: 'Lấy danh sách tài liệu yêu thích' })
  @ApiResponseType(PublicDocumentDto)
  async getFavoriteDocuments(@UserRequest() context: AuthorizedContext) {
    return this.documentService.getFavoriteDocumentsAsync(context);
  }

  @Auth()
  @Patch('favorite-document/:id')
  @ApiOperation({ summary: 'Thêm tài liệu vào yêu thích' })
  async favoriteDocument(
    @Param('id') id: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentService.toggleFavoriteDocumentAsync(context, id);
  }

  @Auth()
  @Get('downloaded-documents')
  @ApiOperation({ summary: 'Lấy danh sách tài liệu đã tải về' })
  @ApiResponseType(DownloadedDocumentDto)
  async getDownloadedDocuments(@UserRequest() context: AuthorizedContext) {
    return this.documentService.getDownloadedDocumentsAsync(context);
  }

  @RBAC(UserRoles.ADMIN)
  @Get('all-downloaded-documents')
  @ApiOperation({
    summary: 'Lấy danh sách tài liệu đã tải về của tất cả người dùng',
  })
  @ApiResponseType(DownloadedDocumentDto)
  async getAllDownloadedDocuments() {
    return this.documentService.getAllDownloadedDocumentsAsync();
  }

  @Auth()
  @Post('post-comment/:documentId')
  @ApiOperation({ summary: 'Đăng bình luận' })
  @ApiResponseType(BaseCommentDto)
  async postComment(
    @Param('documentId') documentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentCommentService.createCommentAsync(
      context,
      documentId,
      createCommentDto,
    );
  }

  @Get('get-comments/:documentId')
  @ApiOperation({ summary: 'Lấy danh sách bình luận' })
  @ApiResponseType(BaseCommentDto, {
    isArray: true,
  })
  async getComments(@Param('documentId') documentId: string) {
    return this.documentCommentService.getCommentsByDocumentIdAsync(documentId);
  }

  @Auth()
  @Patch('update-comment/:commentId')
  @ApiOperation({ summary: 'Cập nhật bình luận' })
  @ApiResponseType(BaseCommentDto)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CreateCommentDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentCommentService.updateCommentAsync(
      context,
      commentId,
      updateCommentDto,
    );
  }

  @Auth()
  @Delete('delete-comment/:commentId')
  @ApiOperation({ summary: 'Xóa bình luận' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentCommentService.deleteCommentAsync(context, commentId);
  }

  @Auth()
  @Post('reply-comment/:commentId')
  @ApiOperation({ summary: 'Trả lời bình luận' })
  @ApiResponseType(BaseCommentDto)
  async replyComment(
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @UserRequest() context: AuthorizedContext,
  ) {
    return this.documentCommentService.replyCommentAsync(
      context,
      commentId,
      createCommentDto,
    );
  }

  @RBAC(UserRoles.ADMIN)
  @Get('get-download-users/:documentId')
  @ApiOperation({ summary: 'Lấy danh sách người dùng đã tải tài liệu' })
  @ApiResponseType(DocumentAnalystDto, {
    isArray: true,
  })
  async getDownloadUsers(@Param('documentId') documentId: string) {
    return this.documentService.getDownloadUsersAsync(documentId);
  }

  @RBAC(UserRoles.ADMIN)
  @Get('get-favorite-users/:documentId')
  @ApiOperation({ summary: 'Lấy danh sách người dùng đã yêu thích tài liệu' })
  @ApiResponseType(DocumentAnalystDto, {
    isArray: true,
  })
  async getFavoriteUsers(@Param('documentId') documentId: string) {
    return this.documentService.getFavoriteUsersAsync(documentId);
  }
}
