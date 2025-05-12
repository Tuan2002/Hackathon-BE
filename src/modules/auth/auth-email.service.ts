import { BaseEmailService } from '@base/modules/email/email.service';
import { EmailTemplates } from 'src/constants/email-template';
import { ResetPasswordMailType } from './types';

export class AuthEmailService extends BaseEmailService {
  constructor() {
    super();
  }

  async sendResetPasswordEmail(
    userEmail: string,
    emailParams: ResetPasswordMailType,
  ) {
    const templateId = EmailTemplates.RESET_PASSWORD;
    await this.sendEmailTemplate(userEmail, templateId, emailParams);
  }
}
