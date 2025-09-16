import { UrlService } from "../services/url-service";
import type { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, internalServerError, notFound, redirect } from "../utils/http";
import { shortUrlSchema } from "../validators/redirect-schema";

export class RedirectController {
	static async handle({ params }: HttpRequest): Promise<HttpResponse> {
		const { success, data, error } = shortUrlSchema.safeParse(params);

		if (!success) {
			return badRequest({ errors: error?.issues });
		}

		const { shortUrl } = data;

		try {
			const urlRecord = await UrlService.getUrlByShortCode(shortUrl);

			if (!urlRecord) {
				return notFound({ message: "Link not found" });
			}

			UrlService.incrementClickCount(shortUrl).catch(console.error);

			return redirect(urlRecord.originalUrl, true);
		} catch (error: unknown) {
			console.error("Error redirecting URL:", error);
			return internalServerError({ message: "Internal server error" });
		}
	}
}
