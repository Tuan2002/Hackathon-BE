import { FileType } from '@base/enums/file.enum';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { GenAiModel } from './enums/genai-model.enum';
@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateTextFromDocumentAsync(
    prompt: string,
    fileBuffer: Buffer,
    mimeType: FileType,
  ) {
    const model = this.genAI.getGenerativeModel({
      model: GenAiModel.GEMINI_2_0_FLASH,
    });
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType,
        },
      },
      prompt,
    ]);

    return result.response.text();
  }
}
