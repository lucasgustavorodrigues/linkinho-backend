import type { HttpRequest, HttpResponse } from "../types/http";
import { ok, redirect } from "../utils/http";

export class RedirectController {
  static async handle({ params }: HttpRequest): Promise<HttpResponse> {
    console.log(params.shortUrl);

    return redirect("https://www.github.com/lucasgustavorodrigues", true);
  }
}
