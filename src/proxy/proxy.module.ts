import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';
import { ConfigModule } from '@nestjs/config';
import { USER_PACKAGE_NAME } from 'src/proto/user';
import { join } from 'path';
import { GrpcForwardService } from './grpc-forward.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          url: process.env.SUB_SERVICE_PORT,
          protoPath: join(__dirname, '../', 'proto/user.proto'),
        },
      },
    ]),
  ],
  providers: [MqttService, GrpcForwardService],
  exports: [MqttService, GrpcForwardService],
})
export class ProxyModule {}
