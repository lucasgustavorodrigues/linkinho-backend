import type { HttpResponse } from "../types/http";

export function parseResponse({ statusCode, body, headers }: HttpResponse) {
  return {
    statusCode,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
}
