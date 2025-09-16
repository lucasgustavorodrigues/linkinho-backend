import z from "zod";
import { isValidUrl, normalizeUrl } from "../utils/url-utils";

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

export const shortenSchema = z.object({
	longUrl: z
		.string()
		.regex(urlRegex, {
			message: "URL inválida",
		})
		.transform(url => normalizeUrl(url))
		.refine(url => isValidUrl(url), {
			message: "URL inválida após normalização",
		}),
});
