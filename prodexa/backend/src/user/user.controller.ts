import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: any) {
    return this.userService.createUser(body);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
