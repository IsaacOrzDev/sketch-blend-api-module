import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  message: string[];
}

export function ApiFormattedResponse(data: {
  type?: any;
  successDescription?: string;
  errorDescription?: string;
  isCreated?: boolean;
}): MethodDecorator & ClassDecorator {
  return applyDecorators(
    data.isCreated
      ? ApiCreatedResponse({
          type: data.type,
          description: data.successDescription,
        })
      : ApiOkResponse({
          type: data.type,
          description: data.successDescription,
        }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ErrorResponse,
    }),
    ApiResponse({
      status: 500,
      description: data.errorDescription ?? 'Internal Server Error',
      type: ErrorResponse,
    }),
  );
}
