import { Module, Controller, forwardRef } from '@nestjs/common';
import { OidcService } from './oidc.service';
import { OidcController } from './oidc.controller';
import {
    OIDC_PROVIDER_MODULE,
    OIDC_PROVIDER,
    OIDC_MODULE_OPTIONS,
    importOidcProvider,
    ESMOidcModule,
    OidcModuleOptions,
    OidcModuleFactoryFn,
    validatePath
} from './oidc.constants';
import { oidcConfig } from './oidc.config';
import { InteractionModule } from '../interaction/interaction.module';

@Module({
    imports: [
        forwardRef(() => InteractionModule), // Interaction 모듈 import
    ],
    providers: [
        // OIDC 모듈 옵션
        {
            provide: OIDC_MODULE_OPTIONS,
            useValue: {
                issuer: 'http://localhost:3000',
                oidc: oidcConfig,
                path: 'oidc',
                proxy: false,
            } as OidcModuleOptions,
        },
        // OIDC Provider 모듈 (ESM)
        {
            provide: OIDC_PROVIDER_MODULE,
            useFactory: async (): Promise<ESMOidcModule> => {
                return importOidcProvider();
            },
        },
        // OIDC Provider 인스턴스
        {
            provide: OIDC_PROVIDER,
            useFactory: async (
                providerModule: ESMOidcModule,
                moduleOptions: OidcModuleOptions,
            ): Promise<any> => {
                // Change controller path manually until Nest doesn't provide an official way for this
                // (see https://github.com/nestjs/nest/issues/1438)
                Controller({
                    path: validatePath(moduleOptions.path),
                    host: moduleOptions.host,
                    version: moduleOptions.version,
                })(OidcController);

                const providerFactory: OidcModuleFactoryFn =
                    moduleOptions.factory ||
                    (({ issuer, config, module }) => new module.default(issuer, config));

                const provider = await Promise.resolve(
                    providerFactory({
                        issuer: moduleOptions.issuer,
                        config: moduleOptions.oidc,
                        module: providerModule,
                    }),
                );

                if (typeof moduleOptions.proxy === 'boolean') {
                    provider.proxy = moduleOptions.proxy;
                }

                return provider;
            },
            inject: [OIDC_PROVIDER_MODULE, OIDC_MODULE_OPTIONS],
        },
        OidcService,
    ],
    controllers: [OidcController],
    exports: [OidcService, OIDC_PROVIDER],
})
export class OidcModule {
    constructor() {
        // AccountAdapter 설정은 InteractionModule에서 처리
    }
} 