import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  constructor(
    public message: string[] = ['Something went wrong'],
    public statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public content?: { [key: string]: any },
    public error?: string,
  ) {}

  private getErrorText(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource Not Found';
      case 422:
        return 'Unprocessable Entity';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad API';
      default:
        return '';
    }
  }

  setMessage(message: string[]): void {
    this.message = message;
  }

  setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
    this.error = this.getErrorText(statusCode);
  }
}
