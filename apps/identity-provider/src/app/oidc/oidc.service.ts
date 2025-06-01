import { Injectable, Inject } from '@nestjs/common';
import { OIDC_PROVIDER } from './oidc.constants';
import { Provider } from './types/oidc.types';

@Injectable()
export class OidcService {
    constructor(
        @Inject(OIDC_PROVIDER) private readonly provider: Provider
    ) { }

    getProvider(): Provider {
        return this.provider;
    }

    getEndpoints() {
        return {
            authorization: '/auth',
            token: '/token',
            userinfo: '/me',
            jwks: '/jwks',
            introspection: '/token/introspection',
            revocation: '/token/revocation',
            end_session: '/session/end',
        };
    }
} 