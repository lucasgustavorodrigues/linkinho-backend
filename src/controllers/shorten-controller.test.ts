import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UrlService } from "../services/url-service";
import type { HttpRequest } from "../types/http";
import { ShortenController } from "./shorten-controller";

vi.mock("../services/url-service", () => ({
	UrlService: {
		createShortUrl: vi.fn(),
	},
}));

describe("Shorten Controller", () => {
	const originalConsoleError = console.error;

	beforeEach(() => {
		vi.clearAllMocks();
		// Silenciar console.error durante os testes
		console.error = vi.fn();
	});

	afterEach(() => {
		console.error = originalConsoleError;
	});

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

	it("should return 201 for valid URL with https protocol", async () => {
		vi.mocked(UrlService.createShortUrl).mockResolvedValue({
			shortCode: "ABC123",
			originalUrl: "https://www.google.com",
			createdAt: "2023-01-01T00:00:00.000Z",
			clickCount: 0,
		});

		const request: HttpRequest = {
			body: { longUrl: "https://www.google.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("shortUrl");
		expect(response.body).toHaveProperty("shortCode");
		expect(response.body).toHaveProperty("originalUrl");
		expect(response.body).toHaveProperty("createdAt");
	});

	it("should return 201 for valid URL without protocol (should be normalized)", async () => {
		vi.mocked(UrlService.createShortUrl).mockResolvedValue({
			shortCode: "DEF456",
			originalUrl: "https://www.instagram.com/user",
			createdAt: "2023-01-01T00:00:00.000Z",
			clickCount: 0,
		});

		const request: HttpRequest = {
			body: { longUrl: "www.instagram.com/user" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("shortUrl");
		expect(response.body).toHaveProperty("originalUrl", "https://www.instagram.com/user");
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

	it("should retry generating short code if collision occurs", async () => {
		vi.mocked(UrlService.createShortUrl)
			.mockRejectedValueOnce(new Error("Short code already exists"))
			.mockResolvedValueOnce({
				shortCode: "GHI789",
				originalUrl: "https://example.com",
				createdAt: "2023-01-01T00:00:00.000Z",
				clickCount: 0,
			});

		const request: HttpRequest = {
			body: { longUrl: "https://example.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(201);
		expect(UrlService.createShortUrl).toHaveBeenCalledTimes(2);
	});

	it("should return 500 if short code already exists during creation after max attempts", async () => {
		vi.mocked(UrlService.createShortUrl).mockRejectedValue(new Error("Short code already exists"));

		const request: HttpRequest = {
			body: { longUrl: "https://example.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(500);
		expect(response.body).toHaveProperty("message", "Unable to generate unique short code after multiple attempts");
		expect(UrlService.createShortUrl).toHaveBeenCalledTimes(3);
	});

	it("should return 500 for other database errors", async () => {
		vi.mocked(UrlService.createShortUrl).mockRejectedValue(new Error("Database connection failed"));

		const request: HttpRequest = {
			body: { longUrl: "https://example.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(500);
		expect(response.body).toHaveProperty("message", "Internal server error");
		expect(UrlService.createShortUrl).toHaveBeenCalledTimes(1);

		expect(console.error).toHaveBeenCalledWith("Error creating short URL:", expect.any(Error));
	});
});
