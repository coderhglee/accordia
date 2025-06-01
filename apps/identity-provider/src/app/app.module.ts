import { Module } from '@nestjs/common';
import { OidcModule } from './oidc/oidc.module';
import { InteractionModule } from './interaction/interaction.module';
import { ViewController } from './view/view.controller';

@Module({
  imports: [OidcModule, InteractionModule],
  controllers: [ViewController],
})
export class AppModule {}
