import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MqttService {
  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {}

  public publish(topic: string, params: any) {
    return firstValueFrom(this.client.send(topic, params));
  }
}
