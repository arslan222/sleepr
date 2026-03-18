import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    const secret = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secret);
  }

  async createCharge({ amount, token, email }: PaymentsCreateChargeDto) {
    const charge = await this.stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      source: token,
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your reservation payment of $${amount} is successful and your reservation is confirmed`,
    });

    return charge;
  }
}
