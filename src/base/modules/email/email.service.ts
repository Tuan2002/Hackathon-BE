import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

export class BaseEmailService {
  protected readonly mailerClient: MailerSend;
  constructor() {
    this.mailerClient = new MailerSend({
      apiKey: process.env.MAILER_SEND_API_KEY,
    });
  }

  async sendEmailTemplate(
    to: string,
    template_id: string,
    context?: Record<string, any>,
  ) {
    const sentFrom = new Sender(
      `support@${process.env.MAILER_SEND_DOMAIN}`,
      'SenseLib Team',
    );

    const recipients = [new Recipient(to)];

    const personalization = [
      {
        email: to,
        data: {
          ...context,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setTemplateId(template_id);

    if (context) {
      emailParams.setPersonalization(personalization);
    }

    await this.mailerClient.email.send(emailParams);
  }
}
