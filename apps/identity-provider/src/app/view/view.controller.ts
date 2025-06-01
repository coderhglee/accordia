import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class ViewController {

    // SPA의 모든 라우팅을 처리 (API 경로가 아닌 모든 경로)
    @Get(['/', '/interaction/*/login', '/interaction/*/consent', '/interaction/*/error'])
    serveSpa(@Res() res: Response) {
        // React SPA의 index.html을 서빙
        return res.sendFile(join(__dirname, '../../../public/index.html'));
    }
} 