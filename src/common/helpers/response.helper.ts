export interface ApiResponseFormat<T = any> {
  message: string;
  data: T | null;
  statusCode: number;
}

export class ApiResponseHelper {
  static success<T>({
    message,
    data,
    statusCode = 200,
  }: {
    message: string;
    data: T;
    statusCode?: number;
  }): ApiResponseFormat<T> {
    return {
      message,
      data: data || null,
      statusCode,
    };
  }

  static error(
    message: string,
    statusCode = 400,
    data: any = null,
  ): ApiResponseFormat {
    return {
      message,
      data,
      statusCode,
    };
  }
}
