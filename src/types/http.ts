/** biome-ignore-all lint/suspicious/noExplicitAny: <since i don't know the body, the any is acceptable> */
export type HttpRequest = {
	body: Record<string, any>;
	queryParams: Record<string, any>;
	params: Record<string, any>;
};
export type HttpResponse = {
	statusCode: number;
	body?: Record<string, any>;
};
