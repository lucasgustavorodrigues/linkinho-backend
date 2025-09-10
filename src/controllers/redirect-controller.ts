import { HttpRequest, HttpResponse } from "../types/http";
import { movedPermanently } from "../utils/http";

export class RedirectController {
  static async handle(request: HttpRequest): Promise<HttpResponse> {
    return movedPermanently({
      url: "https://example.com/original"
    })
  }
}
