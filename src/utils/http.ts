/** biome-ignore-all lint/suspicious/noExplicitAny: <since i don't know the body, the any is acceptable> */
import type { HttpResponse } from "../types/http";

export function ok(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 200,
		body,
	};
}

export function created(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 201,
		body,
	};
}

export function movedPermanently(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 301,
		body,
	};
}

export function badRequest(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 400,
		body,
	};
}

export function notFound(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 404,
		body,
	};
}

export function conflict(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 409,
		body,
	};
}

export function internalServerError(body?: Record<string, any>): HttpResponse {
	return {
		statusCode: 500,
		body,
	};
}

export function redirect(location: string, permanent = false): HttpResponse {
	return {
		statusCode: permanent ? 301 : 302,
		headers: { Location: location },
	};
}
