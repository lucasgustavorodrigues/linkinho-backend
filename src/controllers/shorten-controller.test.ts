import { describe, expect, it } from "vitest";
import type { HttpRequest } from "../types/http";
import { ShortenController } from "./shorten-controller";

describe("Shorten Controller", () => {
	it("should return badRequest (400) if the body property name is incorrect", async () => {
		const request: HttpRequest = {
			body: { url: "https://www.google.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("errors");
	});

	it("should return badRequest (400) if the url is invalid", async () => {
		const request: HttpRequest = {
			body: { longUrl: "invalid-url" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("errors");
	});

	it("should return 201 for valid URL", async () => {
		const request: HttpRequest = {
			body: { longUrl: "https://www.google.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("shortUrl");
	});

	it("should handle missing body", async () => {
		const request: HttpRequest = {
			body: {},
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);
		expect(response.statusCode).toBe(400);
	});
});
