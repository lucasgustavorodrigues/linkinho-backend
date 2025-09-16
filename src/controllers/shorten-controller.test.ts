import { beforeEach, describe, expect, it, vi } from "vitest";
import { UrlService } from "../services/url-service";
import type { HttpRequest } from "../types/http";
import { ShortenController } from "./shorten-controller";

// Mock do UrlService
vi.mock("../services/url-service", () => ({
	UrlService: {
		shortCodeExists: vi.fn(),
		createShortUrl: vi.fn(),
	},
}));

describe("Shorten Controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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
		vi.mocked(UrlService.shortCodeExists).mockResolvedValue(false);
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
		// Mock das funções do UrlService
		vi.mocked(UrlService.shortCodeExists).mockResolvedValue(false);
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
		// Nesse caso eu testo um codigo existente e logo depois
		// um codigo inexistente.
		vi.mocked(UrlService.shortCodeExists).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

		vi.mocked(UrlService.createShortUrl).mockResolvedValue({
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
		expect(UrlService.shortCodeExists).toHaveBeenCalledTimes(2);
	});

	it("should return 409 if short code already exists during creation", async () => {
		vi.mocked(UrlService.shortCodeExists).mockResolvedValue(false);
		vi.mocked(UrlService.createShortUrl).mockRejectedValue(new Error("Short code already exists"));

		const request: HttpRequest = {
			body: { longUrl: "https://example.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(409);
		expect(response.body).toHaveProperty("message", "Short code already exists, please try again");
	});

	it("should return 500 if unable to generate unique short code after max attempts", async () => {
		vi.mocked(UrlService.shortCodeExists).mockResolvedValue(true);

		const request: HttpRequest = {
			body: { longUrl: "https://example.com" },
			params: {},
			queryParams: {},
		};

		const response = await ShortenController.handle(request);

		expect(response.statusCode).toBe(500);
		expect(response.body).toHaveProperty("message");
		expect(response.body).toHaveProperty("message", "Unable to generate unique short code");
	});
});
