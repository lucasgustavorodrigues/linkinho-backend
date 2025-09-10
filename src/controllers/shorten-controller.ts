import { HttpRequest, HttpResponse } from "../types/http";

export class ShortenController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        shortUrl: "https://example.com/shortened",
      },
    };
  }
}
