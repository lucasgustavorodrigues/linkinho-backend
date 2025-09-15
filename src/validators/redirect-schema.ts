import z from "zod";

export const shortUrlSchema = z.object({
	shortUrl: z.string().min(1, { message: "shortUrl é obrigatório" }),
});
