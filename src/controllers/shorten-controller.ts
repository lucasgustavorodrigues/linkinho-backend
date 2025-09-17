import { UrlService } from "../services/url-service";
import type { HttpRequest, HttpResponse } from "../types/http";
import { badRequest, created, internalServerError } from "../utils/http";
import { generateShortCode } from "../utils/url-utils";
import { shortenSchema } from "../validators/shorten-schema";

export class ShortenController {
	static async handle({ body }: HttpRequest): Promise<HttpResponse> {
		const { success, data, error } = shortenSchema.safeParse(body);

		if (!success) {
			return badRequest({ errors: error?.issues });
		}

		const { longUrl } = data;

		try {
			const maxAttempts = 3;

			for (let attempt = 1; attempt <= maxAttempts; attempt++) {
				const shortCode = generateShortCode(6);

				try {
					const urlRecord = await UrlService.createShortUrl(shortCode, longUrl);

					return created({
						shortCode: urlRecord.shortCode,
						shortUrl: `https://linkinho.link/${urlRecord.shortCode}`,
						originalUrl: urlRecord.originalUrl,
						createdAt: urlRecord.createdAt,
					});
				} catch (error: unknown) {
					if (error instanceof Error && error.message === "Short code already exists") {
						if (attempt === maxAttempts) {
							return internalServerError({
								message: "Unable to generate unique short code after multiple attempts",
							});
						}
						continue;
					}
					throw error;
				}
			}

			return internalServerError({ message: "Unable to generate unique short code" });
		} catch (error: unknown) {
			console.error("Error creating short URL:", error);
			return internalServerError({ message: "Internal server error" });
		}
	}
}
