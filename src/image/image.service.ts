import { Injectable } from '@nestjs/common';
import sizeOf from 'image-size';
import axios from 'axios';

@Injectable()
export default class ImageService {
  async getImageSize(imageUrl: string) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    return sizeOf(imageBuffer);
  }
}
