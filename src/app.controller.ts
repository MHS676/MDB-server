import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  checkHealth() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}