import { Injectable } from '@nestjs/common';
import { MqttService } from './proxy/mqtt.service';

@Injectable()
export class AppService {
  constructor(private mqttService: MqttService) {}

  async getTesting() {
    try {
      // const data = await this.mqttService.publish('testing', {});
      // console.log('data', data);
      // return data;
      return 'testing1';
    } catch (err) {
      console.log('err', err);
    }
    return '';
  }
}
