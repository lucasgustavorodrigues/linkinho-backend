import { describe, expect, it } from "vitest";
import { shortenSchema } from "./shorten-schema";

const validUrlsToTest = [
	"https://example.com",
	"https://subdomain.example.com",
	"https://example.com/path/to/page",
	"https://example.com/search?q=test&category=web",
	"https://example.com/page#section",
	"https://example.com:8080",
	"https://site.com.br",
	"https://google.com",
	"https://github.com/user/repo",
	"https://www.amazon.com/product/12345",
	"https://api.example.com/v1/users",
	"google.com/search",
	"subdomain.example.org",
	"site.gov.br",
];
const invalidUrlsToTest = [
	"",
	"ftp://example.com",
	"not-a-url",
	"https://",
	"http://localhost:3000",
	"http://192.168.1.1",
	"https://example .com",
	"http://c&a.com.br",
	"javascript:alert('xss')",
	"data:text/html,<script>alert('xss')</script>",
	"file:///etc/passwd",
	"tel:+1234567890",
	"mailto:test@example.com",
	"invalid-domain",
	"http://",
	"https://.",
	"https://.com",
	"http://example",
	"http://example.",
	"c&a.com.br",
];

describe("shorten-schema", () => {
	describe("valid URLs", () => {
		it("should normalize URLs without protocol to HTTPS", () => {
			const body = { longUrl: "example.com" };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeTruthy();
			expect(result.data?.longUrl).toBe("https://example.com");
		});

		it("should preserve HTTP protocol when provided", () => {
			const body = { longUrl: "http://example.com" };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeTruthy();
			expect(result.data?.longUrl).toBe("http://example.com");
		});

		it.each(validUrlsToTest)("should accept valid URL: %s", url => {
			const body = { longUrl: url };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeTruthy();
		});
	});

	describe("invalid URLs", () => {
		it.each(invalidUrlsToTest)("should reject invalid URL: %s", url => {
			const body = { longUrl: url };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
		});
	});

	describe("edge cases", () => {
		it("should handle missing longUrl property", () => {
			const body = {};
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
			if (!result.success) {
				expect(result.error.issues[0].code).toBe("invalid_type");
			}
		});

		it("should handle null longUrl", () => {
			const body = { longUrl: null };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
		});

		it("should handle undefined longUrl", () => {
			const body = { longUrl: undefined };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
		});

		it("should handle non-string longUrl", () => {
			const body = { longUrl: 123 };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
		});
	});

	describe("URL normalization and validation flow", () => {
		it("should normalize and then validate URL successfully", () => {
			const body = { longUrl: "google.com" };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeTruthy();
			expect(result.data?.longUrl).toBe("https://google.com");
		});

		it("should fail if URL is invalid after normalization", () => {
			const body = { longUrl: "invalid-domain" };
			const result = shortenSchema.safeParse(body);

			expect(result.success).toBeFalsy();
		});
	});
});
