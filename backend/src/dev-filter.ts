import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx       = host.switchToHttp();
        const response  = ctx.getResponse<Response>();
        const request   = ctx.getRequest<Request>();

        let status  = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: any = 'Internal server error';

        // If the exception is an instance of HttpException, get its status and message.
        if (exception instanceof HttpException) {
            status  = exception.getStatus();
            message = exception.getResponse();
        }

        // If the exception is a generic Error.
        else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
        });
    }
}
