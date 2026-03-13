import { Controller, Post, Body, Req } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  @Post('whatsapp')
  async handleWhatsApp(@Body() body: any) {
    console.log('WhatsApp Webhook:', body);
    // Logic to process WhatsApp message and forward to ChatGateway
    return { status: 'success' };
  }

  @Post('facebook')
  async handleFacebook(@Body() body: any) {
    console.log('Facebook Webhook:', body);
    // Logic to process Facebook message
    return { status: 'success' };
  }

  @Post('instagram')
  async handleInstagram(@Body() body: any) {
    console.log('Instagram Webhook:', body);
    // Logic to process Instagram message
    return { status: 'success' };
  }
}
