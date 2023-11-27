import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';

@Injectable()
export class QueueService {
  private sqs: aws.SQS;

  constructor() {
    aws.config.update({
      region: 'us-west-1',
    });
    this.sqs = new aws.SQS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_FOR_SQS,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_SQS,
    });
  }

  public async sendMessage(message: string) {
    const params = {
      MessageBody: message,
      QueueUrl: process.env.AWS_SQS_URL,
    };
    return this.sqs.sendMessage(params).promise();
  }
}
