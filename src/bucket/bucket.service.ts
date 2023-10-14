import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';
import axios from 'axios';
import * as fs from 'fs';
import { BucketUploadBase64Dto, BucketUploadDto } from './bucket.dto';

@Injectable()
export default class BucketService {
  private s3: aws.S3;

  constructor() {
    aws.config.update({
      region: 'us-west-1',
    });
    this.s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_FOR_S3,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FOR_S3,
    });
  }

  public async downloadAndUploadToS3(data: BucketUploadDto) {
    const response = await axios.get(data.url, { responseType: 'arraybuffer' });
    const imageContent = response.data;
    await this.uploadFile({
      bucketName: process.env.S3_IMAGE_BUCKET_NAME,
      fileName: data.fileName,
      fileContent: imageContent,
    });
  }

  public async convertBase64ToBufferAndUpload(data: BucketUploadBase64Dto) {
    const imageBuffer = Buffer.from(data.base64, 'base64');
    await this.uploadFile({
      bucketName: process.env.S3_IMAGE_BUCKET_NAME,
      fileName: data.fileName,
      fileContent: imageBuffer,
    });
  }

  private async uploadFile(params: {
    bucketName: string;
    fileName: string;
    fileContent: Buffer;
  }) {
    return this.s3
      .upload({
        Bucket: params.bucketName,
        Key: params.fileName,
        Body: params.fileContent,
        ContentType: 'image/png',
      })
      .promise();
  }
}
