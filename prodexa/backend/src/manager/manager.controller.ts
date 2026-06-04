/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/prisma/auth/jwt-auth.guard';

import { ManagerService } from './manager.service';

@UseGuards(JwtAuthGuard)
@Controller('manager')

export class ManagerController {

    constructor(

        private readonly managerService:
            ManagerService,
    ) { }

    @Get('overview')
    async getOverview(
        @Req() req,
    ) {

        console.log(
            'JWT USER:',
            req.user,
        );

        return this.managerService
            .getOverview(
                req.user.userId,
            );
    }
}