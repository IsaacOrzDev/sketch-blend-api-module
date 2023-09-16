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
  class CustomResponse {
    @ApiProperty({
      type: Number,
      default: 200,
    })
    statusCode: number;

    @ApiProperty({
      type: () => (data.type !== undefined ? data.type : {}),
    })
    data: any;
  }

  return applyDecorators(
    data.isCreated
      ? ApiCreatedResponse({
          type: CustomResponse,
          description: data.successDescription,
        })
      : ApiOkResponse({
          type: CustomResponse,
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
