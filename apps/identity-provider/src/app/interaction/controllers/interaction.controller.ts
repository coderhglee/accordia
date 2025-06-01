import {
    All,
    ArgumentsHost,
    Body,
    Catch,
    Controller,
    ExceptionFilter,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UseFilters,
    Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectOidcProvider } from '../../oidc/common/oidc-injection.decorators';
import { Provider } from '../../oidc/types/oidc.types';
import { AccountService } from '../services/account.service';

@Catch()
class InteractionFilter implements ExceptionFilter {
    catch(err: any, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        console.error('Interaction Error:', err);
        res.status(err.statusCode || 500).send({
            error: err.message || 'Internal Server Error',
            details: err
        });
    }
}

interface LoginForm {
    login: string;
    password: string;
}

@UseFilters(InteractionFilter)
@Controller('interaction')
export class InteractionController {
    constructor(
        @InjectOidcProvider() private readonly provider: Provider,
        private readonly accountService: AccountService,
    ) { }

    // Interaction 라우팅 처리 - promptType에 따라 적절한 경로로 리다이렉트
    @Get(':uid')
    async handleInteraction(@Req() req: Request, @Res() res: Response, @Param('uid') uid: string) {
        try {
            // OIDC interaction details 확인
            const details = await this.provider.interactionDetails(req);
            const { prompt } = details;

            // promptType에 따라 적절한 경로로 리다이렉트
            if (prompt.name === 'login') {
                return res.redirect(`/interaction/${uid}/login`);
            } else if (prompt.name === 'consent') {
                return res.redirect(`/interaction/${uid}/consent`);
            } else {
                // 알 수 없는 prompt type
                return res.redirect(`/interaction/${uid}/error?type=unknown_prompt`);
            }

        } catch (error) {
            console.error('Handle interaction error:', error);
            // Session이 없는 경우 에러 페이지로 리다이렉트
            return res.redirect(`/interaction/${uid}/error?type=invalid_session`);
        }
    }

    // 로그인 처리 (Form 기반)
    @Post(':uid')
    async processLogin(@Req() req: Request, @Res() res: Response, @Param('uid') uid: string, @Body() body: LoginForm) {
        try {
            const details = await this.provider.interactionDetails(req, res);
            const { prompt } = details;

            if (prompt.name === 'login') {
                const { login, password } = body;

                if (!login || !password) {
                    return res.redirect(`/interaction/${uid}/login?error=missing_credentials`);
                }

                // 사용자 인증
                const user = await this.accountService.authenticateUser(login, password);

                if (!user) {
                    return res.redirect(`/interaction/${uid}/login?error=invalid_credentials`);
                }

                // 인증 성공
                const result = {
                    login: {
                        accountId: user.id,
                    },
                };

                await this.provider.interactionFinished(req, res, result, {
                    mergeWithLastSubmission: false,
                });
            }
        } catch (error) {
            console.error('Process login error:', error);
            res.redirect(`/interaction/${uid}/login?error=server_error`);
        }
    }

    // Consent 승인 처리
    @Post(':uid/confirm')
    async confirmConsent(@Req() req: Request, @Res() res: Response, @Param('uid') uid: string) {
        try {
            const details = await this.provider.interactionDetails(req, res);
            const { prompt, params, session } = details;

            if (!session?.accountId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    error: 'unauthorized',
                    error_description: 'User not authenticated'
                });
            }

            const grant = new this.provider.Grant({
                accountId: session.accountId,
                clientId: params.client_id as string,
            });

            // OIDC scopes 처리
            if (prompt.details.missingOIDCScope) {
                const scopes = prompt.details.missingOIDCScope as string[];
                grant.addOIDCScope(scopes.join(' '));
            }

            // Claims 처리
            if (prompt.details.missingOIDCClaims) {
                grant.addOIDCClaims(prompt.details.missingOIDCClaims);
            }

            // Resource indicators 처리
            if (prompt.details.missingResourceScopes) {
                for (const [indicator, scopes] of Object.entries(prompt.details.missingResourceScopes)) {
                    grant.addResourceScope(indicator, (scopes as string[]).join(' '));
                }
            }

            const grantId = await grant.save();

            const result = {
                consent: {
                    grantId,
                },
            };

            await this.provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: true,
            });
        } catch (error) {
            console.error('Consent confirmation error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'server_error',
                error_description: 'Failed to process consent'
            });
        }
    }

    // Consent 거부 처리
    @Post(':uid/reject')
    async rejectConsent(@Req() req: Request, @Res() res: Response, @Param('uid') uid: string) {
        try {
            const result = {
                error: 'access_denied',
                error_description: 'The user denied the request',
            };

            await this.provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: false,
            });
        } catch (error) {
            console.error('Consent rejection error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: 'server_error',
                error_description: 'Failed to process consent rejection'
            });
        }
    }
} 