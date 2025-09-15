import type { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, notFound, ok, redirect } from "../utils/http";
import { shortUrlSchema } from "../validators/redirect-schema";

export class RedirectController {
	static async handle({ params }: HttpRequest): Promise<HttpResponse> {
		const { success, data, error } = shortUrlSchema.safeParse(params);

		if (!success) {
			return badRequest({ errors: error?.issues });
		}

		if (data.shortUrl !== "Yu5fA") {
			return notFound({ message: "Link not found" });
		}

		return redirect("https://www.github.com/lucasgustavorodrigues", true);
	}
}
