import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { Timestamp } from 'src/grpc/google/protobuf/timestamp';

@Injectable()
export default class FormatUtils {
  public formatTimestamp(value: Timestamp): Date {
    return dayjs.unix((value.seconds as any).low).toDate();
  }
}
