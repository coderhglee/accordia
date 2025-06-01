import { Configuration } from 'oidc-provider';

// AccountService 함수 타입 정의 (외부에서 주입받을 함수들)
export interface OidcAccountAdapter {
    findById: (id: string) => Promise<any>;
    getClaims: (userId: string, scope?: string) => Promise<any>;
}

// AccountService 인스턴스 (외부에서 주입받음)
let accountAdapter: OidcAccountAdapter;

export const setAccountAdapter = (adapter: OidcAccountAdapter) => {
    accountAdapter = adapter;
};

export const oidcConfig: Configuration = {
    // 클라이언트 설정
    clients: [
        {
            client_id: 'test-client',
            // PKCE를 사용하는 Public Client로 변경 (client_secret 제거)
            redirect_uris: ['http://localhost:3000/oidc/test/callback'],
            grant_types: ['authorization_code'],
            response_types: ['code'],
            scope: 'openid profile email',
            token_endpoint_auth_method: 'none', // Public Client
        },
    ],

    pkce: {
        methods: ['S256'],
        required: () => true, // PKCE 필수로 변경
    },

    scopes: [
        'openid',
        'offline_access',
        'profile',
        'email',
        'phone',
        'address',
    ],

    claims: {
        openid: ['sub'],
        profile: ['name', 'given_name', 'family_name', 'preferred_username', 'picture'],
        email: ['email', 'email_verified'],
    },

    // JWT 설정
    jwks: {
        keys: [
            {
                kty: 'RSA',
                kid: 'UWXekTvfWi6o3wfYL9Wbd4f819MKevyQ0V4ksVn_YR0',
                use: 'sig',
                alg: 'RS256',
                e: 'AQAB',
                n: 'oyyqyR4rqOVxj6BhnhETZ3mQclECY4w7dMLzOdU9L514JtSmXFfsbL7sLC-Y6y88mTK7JZs073HMYgTJZqIBThxjl_F-TRoO5Svi488GsCk5osgP9xQul-4yx1gfqeQhQZdxo73R0EjO_kZR_i85AAz-O0BvUNiayeYUU23pNU_Q_fIZ-IWRSD15JeNNuROVkjpR8ocpEtOVsb3x0PpCzpkxXb7gh8HYpCHaJEj2k8mJstuOfLOm-eIHcrUv7uEYzSWSK6tfFNFsdwmHioRlY2-ASuvxq9Xqplz9-K5tW3dYE3B3wNIPdYPOAhpSwsD7dlwfM_lj269QULfsYDKnRQ',
                d: 'j-S24s5BUBqtryuOifai9u_jqnu3sJOcZtX36TsbTt79cri5z9sVObyPxlNe9Z7dQHfVQ0-AOdtPkeyIsoIQxpIQXZBvgYyGMCAoYB5T1os0MVFditR4VjCPBO24Vng_v3jOlMeyu4tJRkA60_1OtbW_h_7FazToIz1LFVtqeUB15ZczdjejAj4zQWTdLDyfL1Ez2d_KISq83q4XcwI3kgAsjCvkYAzR42jnrJB3W9tR1X9AYI6bsb1LVZCHlvAGJf6zrPTNhBz2owcs7YGPMwnxRLO0JZ__lr-f513Q9YkuBzCf14YhFBNkUGzH-52tcFZRfy50e9NaG-u-BU3wTQ',
                p: '0_HqVVfKJ1BXYnuOWMEd4eC8nS4Og-CZwi8nvKR3FqRKFSiST6Q0PIi1JQXi4SviIyvEdyUXc_aP8KrgjP8ervW6XiYmT1UKwMkhauIiCpOw7MsCMzt0Ol_EOgAXiCupMny0-NPEqzKx3e-64cvQq3V0hZnM-l0rHVKnABBfnu8',
                q: 'xRePZvrTSLhlI_7uq6LWRsYrz5afPq18DZNuxTg8Dp-PzVZNFxIV1EYB370BJYhaJ7d81vaWsTFtrj89cK9hnOtMqr_slo0YSGBk10PX5mPaG_Wlx_u7V8BUguVTiq320kVRXwqCYRNB4YaYpvbQ8j345fmogAETQgZ6hCZGXQs',
                dp: 'yrmUaPlF1YDVdM-2AlMFoC50euu42o-UwtaT7a5qcm_GpKJgAGmRxW0Fx1nv_20YKogMreH-ot7uI0du7a6AzN0h3DglYLB5TpmTq0aNRQyrqHMtsY9mxwcfDFNWLtuERVRfTbpRXWdqFlzdpmhrOfVo9Pl9xOQk_zE1p6wBqmU',
                dq: 'SLesnR4mHkqKZoGEpabq0CoFuA2mq4Vuo8OltvZMkkik0enpf32YuD0sK9ScO7DXMpgsY1OPvciy4vtKO-05YqAeJVGyhMmCEBIgopvRaJumuXIkvGhQcsvvYmwiKqSM0H_qydoiyJZGVGNIpzGhXf8nehJm7PN4m3-wbFmC1Ik',
                qi: 'Wr4sxOqITkM1VrlwUGe9S3q8lbQJD1_nVM-x862jckuRuhtfq5HooOcJs2eVxEZLvwxnKvuMCtrrdkeQt6ORdGXjU2xNMzBV2ohvksh4nd-dAbt1k4sz_h-6SOfWOzQz3f9x6aRQabvwUfUR3TmnrZWNmgXO7b9RJEWYB6K8aWo',
            },
        ],
    },

    // 지원할 기능들
    features: {
        // 기본적인 OpenID Connect 기능들
        devInteractions: { enabled: false }, // 프로덕션에서는 false
        deviceFlow: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        userinfo: { enabled: true },
    },

    // Consent 설정
    conformIdTokenClaims: false,

    // Interaction 설정
    interactions: {
        url(ctx, interaction) {
            return `/interaction/${interaction.uid}`;
        },
    },

    // Client-based CORS 설정 (React SPA 지원)
    clientBasedCORS: (ctx, origin, client) => {
        // 개발 환경에서는 모든 origin 허용
        if (process.env.NODE_ENV === 'development') {
            return true;
        }
        // 프로덕션에서는 특정 origin만 허용
        return origin === 'http://localhost:3000';
    },

    // 계정 찾기 함수 (외부 AccountService 사용)
    findAccount: async (ctx, id, token) => {
        if (!accountAdapter) {
            throw new Error('AccountAdapter not initialized');
        }

        const user = await accountAdapter.findById(id);
        if (!user) return undefined;

        return {
            accountId: id,
            async claims(use, scope) {
                return await accountAdapter.getClaims(id, scope);
            },
        };
    },

    // 토큰 설정
    ttl: {
        AccessToken: 60 * 60, // 1시간
        AuthorizationCode: 10 * 60, // 10분
        IdToken: 60 * 60, // 1시간
        RefreshToken: 24 * 60 * 60, // 24시간
        Interaction: 60 * 60, // 1시간 (중요: Interaction session TTL)
        Session: 24 * 60 * 60, // 24시간
    },

    // 쿠키 설정 (React SPA 지원)
    cookies: {
        keys: ['some-secret-key'], // 실제 환경에서는 안전한 키를 사용해야 합니다
        long: {
            // 장기 쿠키 설정 (세션 등)
            signed: true,
            httpOnly: true,
            sameSite: 'lax', // 같은 도메인에서 서빙되므로 lax 사용
            secure: false, // localhost에서는 false
        },
        short: {
            // 단기 쿠키 설정 (interaction 등)
            signed: true,
            httpOnly: true,
            sameSite: 'lax', // 같은 도메인에서 서빙되므로 lax 사용
            secure: false, // localhost에서는 false
        },
        names: {
            session: '_session', // 세션 쿠키 이름
            interaction: '_interaction', // Interaction 쿠키 이름
            resume: '_interaction_resume', // Resume 쿠키 이름
            state: '_state', // State 쿠키 이름
        },
    },

    // 에러 처리
    renderError: async (ctx, out, error) => {
        ctx.type = 'html';
        ctx.body = `
      <!DOCTYPE html>
      <html>
        <head><title>OIDC Error</title></head>
        <body>
          <h1>Error</h1>
          <p>${JSON.stringify(error)}</p>
        </body>
      </html>
    `;
    },

    // Refresh Token 설정
    issueRefreshToken: async (ctx, client, code) => {
        // authorization_code grant에서 refresh token 발급
        if (client.grantTypeAllowed('authorization_code')) {
            return true;
        }
        return false;
    },
}; 