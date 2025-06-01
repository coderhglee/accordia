import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { OidcModule } from '../oidc/oidc.module';
import { setAccountAdapter } from '../oidc/oidc.config';
import { InteractionController } from './controllers/interaction.controller';
import { AccountService } from './services/account.service';

@Module({
    imports: [
        forwardRef(() => OidcModule), // OIDC Provider 인젝션을 위한 forwardRef
    ],
    controllers: [InteractionController],
    providers: [AccountService],
    exports: [AccountService], // OIDC 모듈에서 사용할 수 있도록 export
})
export class InteractionModule implements OnModuleInit {
    constructor(private readonly accountService: AccountService) { }

    onModuleInit() {
        setAccountAdapter({
            findById: (id: string) => this.accountService.findById(id),
            getClaims: (userId: string, scope?: string) => this.accountService.getClaims(userId, scope),
        });
    }
} 