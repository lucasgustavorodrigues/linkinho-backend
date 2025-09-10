import { HttpRequest, HttpResponse } from "../types/http";
import { created } from "../utils/http";

export class ShortenController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return created({
      shortUrl: "https://example.com/shortened",
    })
  }
}
