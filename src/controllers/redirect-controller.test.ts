import { describe, expect, it } from "vitest";
import type { HttpRequest } from "../types/http";
import { RedirectController } from "./redirect-controller";

describe("RedirectController", () => {
	it("should redirect to original URL when short URL exists", async () => {
		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "Yu5fA" },
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(301);
		expect(response.headers).toHaveProperty("Location");
	});

	it("should return 404 when short URL does not exist", async () => {
		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "nonexistent" },
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty("message", "Link not found");
	});

	it("should return 404 when shortUrl param is missing", async () => {
		const request: HttpRequest = {
			body: {},
			params: {},
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("errors");
	});
});
