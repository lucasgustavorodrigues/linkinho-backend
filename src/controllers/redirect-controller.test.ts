import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UrlService } from "../services/url-service";
import type { HttpRequest } from "../types/http";
import { RedirectController } from "./redirect-controller";

vi.mock("../services/url-service", () => ({
	UrlService: {
		getUrlByShortCode: vi.fn(),
		incrementClickCount: vi.fn(),
	},
}));

describe("RedirectController", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should redirect to original URL when short URL exists", async () => {
		vi.mocked(UrlService.getUrlByShortCode).mockResolvedValue({
			shortCode: "Yu5fA",
			originalUrl: "https://www.google.com",
			createdAt: "2023-01-01T00:00:00.000Z",
			clickCount: 5,
		});

		vi.mocked(UrlService.incrementClickCount).mockResolvedValue();

		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "Yu5fA" },
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(301);
		expect(response.headers).toHaveProperty("Location", "https://www.google.com");
		expect(UrlService.incrementClickCount).toHaveBeenCalledWith("Yu5fA");
	});

	it("should return 404 when short URL does not exist", async () => {
		vi.mocked(UrlService.getUrlByShortCode).mockResolvedValue(null);

		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "nonexistent" },
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(404);
		expect(response.body).toHaveProperty("message", "Link not found");
		expect(UrlService.incrementClickCount).not.toHaveBeenCalled();
	});

	it("should return 400 when shortUrl param is missing", async () => {
		const request: HttpRequest = {
			body: {},
			params: {},
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("errors");
		expect(UrlService.getUrlByShortCode).not.toHaveBeenCalled();
	});

	it("should handle database errors gracefully", async () => {
		vi.mocked(UrlService.getUrlByShortCode).mockRejectedValue("Database error");

		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "valid-code" },
			queryParams: {},
		};

		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(500);
		expect(response.body).toHaveProperty("message", "Internal server error");
	});

	it("should handle increment click count errors gracefully", async () => {
		vi.mocked(UrlService.getUrlByShortCode).mockResolvedValue({
			shortCode: "Yu5fA",
			originalUrl: "https://www.google.com",
			createdAt: "2023-01-01T00:00:00.000Z",
			clickCount: 5,
		});

		vi.mocked(UrlService.incrementClickCount).mockRejectedValue("Update failed");

		const request: HttpRequest = {
			body: {},
			params: { shortUrl: "Yu5fA" },
			queryParams: {},
		};

		// Aqui eu redireciono mesmo com erro no incremento
		const response = await RedirectController.handle(request);

		expect(response.statusCode).toBe(301);
		expect(response.headers).toHaveProperty("Location", "https://www.google.com");
	});
});
