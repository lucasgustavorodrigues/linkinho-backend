import z from "zod";

// Regex que aceita URLs com ou sem protocolo
const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

function normalizeUrl(url: string): string {
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		return `https://${url}`;
	}
	return url;
}

function isValidUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
	} catch {
		return false;
	}
}

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
