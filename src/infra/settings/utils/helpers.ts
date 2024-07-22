import { HttpResponse, HttpStatusCode } from "./protocols";

export const ok = <T>(
  body: any
): HttpResponse<{ success: boolean; message: string }> => ({
  statusCode: HttpStatusCode.OK,
  body,
});

export const created = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttpStatusCode.CREATED,
  body,
});

export const badRequest = (
  message: string
): HttpResponse<{ success: boolean; message: string }> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: { success: false, message },
  };
};

export const notFound = (
  message: string
): HttpResponse<{ success: boolean; message: string }> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: { success: false, message },
  };
};

export const serverError = (
  body: any
): HttpResponse<{ success: boolean; message: string }> => {
  return {
    statusCode: HttpStatusCode.SERVER_ERROR,
    body,
  };
};
