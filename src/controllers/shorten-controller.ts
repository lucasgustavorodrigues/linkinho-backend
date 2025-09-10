import type { HttpRequest, HttpResponse } from '../types/http';
import { badRequest, created } from '../utils/http';
import { shortenSchema } from '../validators/shorten-schema';

export class ShortenController {
	static async handle({ body }: HttpRequest): Promise<HttpResponse> {
		const { success, data, error } = shortenSchema.safeParse(body);

		if (!success) {
			return badRequest({ errors: error?.issues });
		}

		return created({
			shortUrl: data,
		});
	}
}
