import { ConfigAppModule } from '@base/modules/configs/config-app.module';
import { DatabaseModule } from '@base/modules/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthorModule } from '@modules/author/author.module';
import { CategoryModule } from '@modules/category/category.module';
import { DocumentModule } from '@modules/document/document.module';
import { FeedbackModule } from '@modules/feedback/feedback.module';
import { PublisherModule } from '@modules/publisher/publisher.module';
import { SharedModule } from '@modules/shared/shared.module';
import { SystemModule } from '@modules/system/system.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigAppModule,
    DatabaseModule,
    PassportModule,
    AuthModule,
    UserModule,
    CategoryModule,
    AuthorModule,
    PublisherModule,
    SystemModule,
    DocumentModule,
    FeedbackModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
