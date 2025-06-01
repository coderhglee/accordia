import {
    All,
    Controller,
    Req,
    Res,
    VERSION_NEUTRAL,
    VersioningType,
} from '@nestjs/common';
import { PATH_METADATA, VERSION_METADATA } from '@nestjs/common/constants';
import { ModuleRef } from '@nestjs/core';
import type { Request, Response } from 'express';
import { InjectOidcProvider } from './common/oidc-injection.decorators';
import { Provider } from './types/oidc.types';

@Controller()
export class OidcController {
    private callback: (req: Request, res: Response) => void;

    constructor(
        @InjectOidcProvider() readonly provider: Provider,
        private readonly moduleRef: ModuleRef,
    ) {
        this.callback = provider.callback();
    }

    // 테스트 페이지 추가
    @All('test')
    public testPage(@Req() req: Request, @Res() res: Response): void {
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.type('html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OIDC Provider Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .test-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }

        h1 {
            text-align: center;
            color: #1a202c;
            font-size: 28px;
            margin-bottom: 8px;
        }

        .subtitle {
            text-align: center;
            color: #718096;
            margin-bottom: 40px;
        }

        .test-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
        }

        .test-section h3 {
            color: #374151;
            margin-bottom: 12px;
            font-size: 18px;
        }

        .test-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
            margin: 8px 8px 8px 0;
        }

        .test-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .url-box {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            color: #374151;
        }

        .info-box {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 12px;
            margin: 16px 0;
            font-size: 14px;
            color: #1e40af;
        }

        .pkce-box {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 12px;
            margin: 16px 0;
            font-size: 14px;
            color: #0369a1;
        }

        .endpoint-list {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
        }

        .endpoint-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .endpoint-item:last-child {
            border-bottom: none;
        }

        .endpoint-name {
            font-weight: 600;
            color: #374151;
        }

        .endpoint-url {
            font-family: monospace;
            font-size: 12px;
            color: #6b7280;
        }

        .copy-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            color: #374151;
        }

        .copy-btn:hover {
            background: #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>🔐 OIDC Provider Test</h1>
        <p class="subtitle">OpenID Connect Provider 테스트 도구 (PKCE 지원)</p>

        <div class="test-section">
            <h3>🚀 빠른 인증 테스트 (PKCE)</h3>
            <p style="margin-bottom: 16px; color: #6b7280;">PKCE를 사용한 보안 강화 인증 플로우를 테스트해보세요:</p>
            
            <button onclick="startPKCEAuth()" class="test-button">
                🔑 PKCE 인증 시작하기
            </button>

            <div class="pkce-box">
                <strong>PKCE (Proof Key for Code Exchange):</strong> 보안 강화를 위해 code_verifier와 code_challenge를 사용합니다. 버튼을 클릭하면 자동으로 PKCE 파라미터가 생성됩니다.
            </div>

            <div id="pkce-info" style="display: none;">
                <h4>📋 생성된 PKCE 파라미터:</h4>
                <p><strong>Code Verifier:</strong></p>
                <div class="url-box" id="code-verifier"></div>
                <p><strong>Code Challenge:</strong></p>
                <div class="url-box" id="code-challenge"></div>
            </div>
        </div>

        <div class="test-section">
            <h3>🔗 주요 엔드포인트</h3>
            <div class="endpoint-list">
                <div class="endpoint-item">
                    <span class="endpoint-name">Discovery</span>
                    <div>
                        <span class="endpoint-url">${baseUrl}/oidc/.well-known/openid-configuration</span>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/oidc/.well-known/openid-configuration')">복사</button>
                    </div>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-name">Authorization</span>
                    <div>
                        <span class="endpoint-url">${baseUrl}/oidc/auth</span>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/oidc/auth')">복사</button>
                    </div>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-name">Token</span>
                    <div>
                        <span class="endpoint-url">${baseUrl}/oidc/token</span>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/oidc/token')">복사</button>
                    </div>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-name">UserInfo</span>
                    <div>
                        <span class="endpoint-url">${baseUrl}/oidc/me</span>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/oidc/me')">복사</button>
                    </div>
                </div>
                <div class="endpoint-item">
                    <span class="endpoint-name">JWKS</span>
                    <div>
                        <span class="endpoint-url">${baseUrl}/oidc/jwks</span>
                        <button class="copy-btn" onclick="copyToClipboard('${baseUrl}/oidc/jwks')">복사</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="test-section">
            <h3>⚙️ 설정된 클라이언트 정보</h3>
            <div style="background: white; padding: 16px; border-radius: 6px; margin-top: 12px;">
                <p><strong>Client ID:</strong> test-client</p>
                <p><strong>Redirect URI:</strong> ${baseUrl}/oidc/test/callback</p>
                <p style="margin-top: 12px;"><strong>Supported Scopes:</strong> openid, profile, email, offline_access</p>
                <p><strong>Response Types:</strong> code</p>
                <p><strong>Grant Types:</strong> authorization_code</p>
                <p><strong>PKCE:</strong> Supported (S256)</p>
                <p><strong>Refresh Token:</strong> Supported</p>
            </div>
        </div>
    </div>

    <script>
        // PKCE 관련 전역 변수
        window.currentCodeVerifier = '';

        // Base64 URL Safe 인코딩
        window.base64URLSafe = function(str) {
            return btoa(str)
                .replace(/\\+/g, '-')
                .replace(/\\//g, '_')
                .replace(/=/g, '');
        };

        // SHA256 해시 함수
        window.sha256 = async function(plain) {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            const hash = await window.crypto.subtle.digest('SHA-256', data);
            return String.fromCharCode(...new Uint8Array(hash));
        };

        // Code Verifier 생성 (43-128 글자의 랜덤 문자열)
        window.generateCodeVerifier = function() {
            const array = new Uint8Array(32);
            window.crypto.getRandomValues(array);
            return window.base64URLSafe(String.fromCharCode(...array));
        };

        // Code Challenge 생성 (Code Verifier의 SHA256 해시)
        window.generateCodeChallenge = async function(verifier) {
            const hashed = await window.sha256(verifier);
            return window.base64URLSafe(hashed);
        };

        // PKCE 인증 시작
        window.startPKCEAuth = async function() {
            try {
                // PKCE 파라미터 생성
                window.currentCodeVerifier = window.generateCodeVerifier();
                const codeChallenge = await window.generateCodeChallenge(window.currentCodeVerifier);

                // PKCE 정보 표시
                document.getElementById('code-verifier').textContent = window.currentCodeVerifier;
                document.getElementById('code-challenge').textContent = codeChallenge;
                document.getElementById('pkce-info').style.display = 'block';

                // localStorage에 code_verifier 저장 (콜백에서 사용)
                localStorage.setItem('pkce_code_verifier', window.currentCodeVerifier);

                // Authorization URL 생성
                const authUrl = '${baseUrl}/oidc/auth?' + 
                    'client_id=test-client&' +
                    'redirect_uri=${baseUrl}/oidc/test/callback&' +
                    'response_type=code&' +
                    'scope=openid%20profile%20email&' +
                    'state=test-state-' + Date.now() + '&' +
                    'nonce=test-nonce-' + Date.now() + '&' +
                    'code_challenge=' + encodeURIComponent(codeChallenge) + '&' +
                    'code_challenge_method=S256';

                // 인증 페이지로 이동
                window.location.href = authUrl;
            } catch (error) {
                console.error('PKCE 인증 시작 오류:', error);
                alert('PKCE 파라미터 생성 중 오류가 발생했습니다.');
            }
        };

        window.copyToClipboard = function(text) {
            navigator.clipboard.writeText(text).then(function() {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '복사됨!';
                btn.style.background = '#10b981';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#f3f4f6';
                    btn.style.color = '#374151';
                }, 1000);
            });
        };
    </script>
</body>
</html>
        `);
    }

    // 테스트 콜백 엔드포인트 추가
    @All('test/callback')
    public testCallback(@Req() req: Request, @Res() res: Response): void {
        const { code, state, error, error_description } = req.query;

        res.type('html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OIDC Callback Result</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .result-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }

        .success {
            border-left: 4px solid #10b981;
            background: #d1fae5;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .error {
            border-left: 4px solid #ef4444;
            background: #fee2e2;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .code-box {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 12px;
            font-family: monospace;
            font-size: 14px;
            word-break: break-all;
            margin: 12px 0;
        }

        .back-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
            margin-top: 20px;
        }

        .back-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        h1 {
            color: #1a202c;
            margin-bottom: 20px;
        }

        .info-section {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
        }

        .copy-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="result-container">
        <h1>🔄 콜백 결과</h1>

        ${error ? `
            <div class="error">
                <h3>❌ 인증 실패</h3>
                <p><strong>Error:</strong> ${error}</p>
                ${error_description ? `<p><strong>Description:</strong> ${error_description}</p>` : ''}
            </div>
        ` : `
            <div class="success">
                <h3>✅ 인증 성공!</h3>
                <p>Authorization Code를 성공적으로 받았습니다.</p>
            </div>

            <div class="info-section">
                <h4>📋 받은 데이터:</h4>
                <p><strong>Authorization Code:</strong></p>
                <div class="code-box">
                    ${code}
                    <button class="copy-btn" onclick="copyToClipboard('${code}')">복사</button>
                </div>
                
                ${state ? `
                    <p><strong>State:</strong></p>
                    <div class="code-box">${state}</div>
                ` : ''}
            </div>

            <div class="info-section">
                <h4>🔄 다음 단계 (토큰 교환 with PKCE):</h4>
                <p>이제 이 Authorization Code와 Code Verifier를 사용해서 Access Token을 요청할 수 있습니다:</p>
                <div class="code-box">
curl -X POST ${req.protocol}://${req.get('host')}/oidc/token \\<br>
&nbsp;&nbsp;-H "Content-Type: application/x-www-form-urlencoded" \\<br>
&nbsp;&nbsp;-d "grant_type=authorization_code&code=${code}&client_id=test-client&redirect_uri=${req.protocol}://${req.get('host')}/oidc/test/callback&code_verifier=<CODE_VERIFIER>"
                </div>
                <button class="copy-btn" onclick="generateTokenCommand('${code}', '${req.protocol}://${req.get('host')}')">
                    cURL 명령어 생성
                </button>
                <div id="token-command" style="display: none; margin-top: 12px;">
                    <div class="code-box" id="token-curl"></div>
                    <button class="copy-btn" onclick="copyTokenCommand()">cURL 명령어 복사</button>
                </div>
            </div>
        `}

        <a href="/oidc/test" class="back-button">🔙 테스트 페이지로 돌아가기</a>
    </div>

    <script>
        let tokenCurlCommand = '';

        function generateTokenCommand(code, baseUrl) {
            // localStorage에서 code_verifier 가져오기
            const codeVerifier = localStorage.getItem('pkce_code_verifier');
            if (!codeVerifier) {
                alert('Code Verifier를 찾을 수 없습니다. 인증을 다시 시작해주세요.');
                return;
            }

            // PKCE를 포함한 토큰 교환 명령어 생성
            tokenCurlCommand = 'curl -X POST ' + baseUrl + '/oidc/token -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=authorization_code&code=' + code + '&client_id=test-client&redirect_uri=' + baseUrl + '/oidc/test/callback&code_verifier=' + codeVerifier + '"';
            
            document.getElementById('token-curl').textContent = tokenCurlCommand;
            document.getElementById('token-command').style.display = 'block';

            // localStorage에서 code_verifier 제거 (보안)
            localStorage.removeItem('pkce_code_verifier');
        }

        function copyTokenCommand() {
            if (tokenCurlCommand) {
                copyToClipboard(tokenCurlCommand);
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(function() {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '복사됨!';
                btn.style.background = '#10b981';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#f3f4f6';
                    btn.style.color = '#374151';
                }, 1000);
            });
        }
    </script>
</body>
</html>
        `);
    }

    private getUrl(originalUrl: string) {
        let resultUrl = originalUrl;
        const appConfig = this.moduleRef['container']!.applicationConfig;
        const globalPrefix = appConfig!.getGlobalPrefix();
        const versioning = appConfig!.getVersioning();

        // Remove global prefix
        if (globalPrefix) {
            resultUrl = resultUrl.replace(globalPrefix, '');
        }

        // Remove version
        if (versioning?.type === VersioningType.URI) {
            const version: string | symbol =
                Reflect.getMetadata(VERSION_METADATA, OidcController) ??
                versioning.defaultVersion;

            if (version && version !== VERSION_NEUTRAL) {
                resultUrl = resultUrl.replace(/^\/+[^/]+/, '');
            }
        }

        // Remove controller path
        const controllerPath = Reflect.getMetadata(PATH_METADATA, OidcController);
        resultUrl = resultUrl.replace(controllerPath, '');

        // Normalize
        return `/${resultUrl}`.replace(/^\/+/, '/');
    }

    @All('/*')
    public mountedOidc(@Req() req: Request, @Res() res: Response): void {
        req.url = this.getUrl(req.originalUrl);
        return this.callback(req, res);
    }
} 