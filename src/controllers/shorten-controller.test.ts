import { describe, expect, it } from "vitest";
import type { HttpRequest } from "../types/http";
import { ShortenController } from "./shorten-controller";

describe("Shorten Controller", () => {
	it("should return badRequest (400) if the url is invalid", async () => {
		const request: HttpRequest = {
			body: { url: "invalid-url" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("errors");
	});
});
