import { RedisCacheModule } from '@base/modules/cache/redis.cache.module';
import { EmailModule } from '@base/modules/email/email.module';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  imports: [RedisCacheModule, EmailModule],
  controllers: [],
  providers: [],
  exports: [RedisCacheModule, EmailModule],
})
export class SharedModule {}
