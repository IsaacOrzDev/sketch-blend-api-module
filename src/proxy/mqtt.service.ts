import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MqttService {
  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {}

  public async publish(topic: string, params: any) {
    const result = await firstValueFrom(this.client.send(topic, params));
    if (result === 'Invalid topic') {
      return { error: 'Invalid topic' };
    }
  }
}
