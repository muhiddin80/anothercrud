import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import path from "path";
import { timestamp } from "rxjs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>();
        const data = exception.getResponse();
        const status = exception.getStatus();
        response
            .status(status)
            .json({
                statusCode:status,
                message:data.message,
                timestamp:new Date().toISOString(),
                path:request.url,
            })
    }
}