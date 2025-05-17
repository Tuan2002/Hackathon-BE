import { FileType } from '@base/enums/file.enum';
import { ChatSession } from '@google/generative-ai';
import { GenAiModel } from '@modules/gemini/enums/genai-model.enum';
import { GeminiService } from '@modules/gemini/gemini.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { corsConfig } from 'src/configs/cors.config';
import { Repository } from 'typeorm';
import { DocumentFileService } from './document-file.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { Document } from './entities/document.entity';
import { ChatPrompt } from './enums/chat-prompt.enum';
import {
    SocketClientEvents,
    SocketNames,
    SocketServerEvents,
} from './enums/socket-io.enum';

@WebSocketGateway({
  namespace: SocketNames.DOCUMENT_CHAT,
  cors: corsConfig,
})
@Injectable()
export class DocumentChatGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  private logger = new Logger(DocumentChatGateway.name);
  private chatSessions: Map<string, ChatSession> = new Map();

  @WebSocketServer() server: Namespace;
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly documentFileService: DocumentFileService,
    private readonly geminiService: GeminiService,
  ) {}

  afterInit() {
    this.logger.debug(`[WEBSOCKET RUN] -------`);
  }

  handleConnection(client: Socket) {
    this.logger.debug(`[WEBSOCKET CONNECT] ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`[WEBSOCKET DISCONNECT] ${client.id}`);
    this.chatSessions.delete(client.id);
  }

  @SubscribeMessage(SocketClientEvents.CLIENT_START_CHAT)
  async onClientStartChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatData: ChatMessageDto,
  ) {
    this.logger.debug(`[WEBSOCKET START CHAT] ${client.id}`);
    client.emit(SocketServerEvents.SERVER_START_THINKING, {});

    let chat;
    const chatModel = this.geminiService.createModelAsync(
      GenAiModel.GEMINI_2_0_FLASH,
    );

    if (!chatData?.documentId) {
      chat = chatModel.startChat();
      this.chatSessions.set(client.id, chat);
      client.emit(SocketServerEvents.SERVER_STOP_THINKING, {});
      client.emit(SocketServerEvents.SERVER_SEND_MESSAGE, {
        message: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      });
      return;
    }

    // Check if the document exists
    const document = await this.documentRepository.findOne({
      where: { id: chatData.documentId },
    });

    if (document && document.fileKey) {
      client.emit(SocketServerEvents.SERVER_SEND_MESSAGE, {
        message: 'Đang lấy thông tin tài liệu...',
      });

      const fileBuffer = await this.documentFileService.convertToPdfAsync(
        document.fileKey,
        document.fileName,
        document.fileType,
      );

      if (fileBuffer) {
        chat = chatModel.startChat({
          history: [
            {
              role: 'user',
              parts: [
                { text: ChatPrompt.DOCUMENT_INIT_QUESTION },
                {
                  inlineData: {
                    data: fileBuffer.toString('base64'),
                    mimeType: FileType.PDF,
                  },
                },
              ],
            },
          ],
        });
        client.emit(SocketServerEvents.SERVER_SEND_MESSAGE, {
          message: 'Đã tải tài liệu thành công...',
        });
      } else {
        chat = chatModel.startChat({
          cachedContent: document.description,
        });
      }
    } else {
      chat = chatModel.startChat();
    }

    this.chatSessions.set(client.id, chat);
    client.emit(SocketServerEvents.SERVER_STOP_THINKING, {});
    client.emit(SocketServerEvents.SERVER_SEND_MESSAGE, {
      message: 'Xin chào! Tôi có thể giúp gì cho bạn?',
    });
  }

  @SubscribeMessage(SocketClientEvents.CLIENT_SEND_MESSAGE)
  async onClientSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatData: ChatMessageDto,
  ) {
    const chat = this.chatSessions.get(client.id);
    if (!chat) {
      client.emit(SocketServerEvents.SERVER_SEND_ERROR, {
        message: 'Bạn chưa bắt đầu cuộc trò chuyện',
      });
      return;
    }
    client.emit(SocketServerEvents.SERVER_START_THINKING, {});
    const data = await chat.sendMessage(chatData.message || '');
    const messageResponse = await data.response.text();

    client.emit(SocketServerEvents.SERVER_STOP_THINKING, {});
    client.emit(SocketServerEvents.SERVER_SEND_MESSAGE, {
      message: messageResponse,
    });
  }

  @SubscribeMessage(SocketClientEvents.CLIENT_CLOSE_CHAT)
  async onClientCloseChat(@ConnectedSocket() client: Socket) {
    const chat = this.chatSessions.get(client.id);
    if (chat) {
      this.chatSessions.delete(client.id);
    }

    client.emit(SocketServerEvents.SERVER_CLOSE_CHAT, {
      message: 'Cuộc trò chuyện đã kết thúc',
    });
  }
}
