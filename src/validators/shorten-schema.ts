import z from "zod";

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
export const shortenSchema = z.object({
	longUrl: z.string().regex(urlRegex, {
		message: "URL inválida",
	}),
});
