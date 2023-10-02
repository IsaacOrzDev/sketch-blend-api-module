import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';

@Injectable()
export class EmailService {
  private sns: aws.SNS;

  constructor() {
    aws.config.update({
      region: 'us-west-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_FOR_EMAIL,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_EMAIL,
      },
    });
    this.sns = new aws.SNS();
  }

  public sendEmail(params: {
    to: string[];
    subject: string;
    content?: string;
    template?: string;
    data?: any;
  }) {
    return this.sns
      .publish({
        Message: JSON.stringify({
          from: process.env.SENDER_EMAIL,
          ...params,
        }),
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
      .promise();
  }
}
