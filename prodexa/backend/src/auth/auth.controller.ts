import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req, @Res() res) {
    const { token } = req.user;
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
}
