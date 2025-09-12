import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShortenController } from "../controllers/shorten-controller";
import { parseEvent } from "../utils/parse-event";
import { parseResponse } from "../utils/parse-response";

export async function handler(event: APIGatewayProxyEventV2) {
	const request = parseEvent(event);
	const response = await ShortenController.handle(request);
	return parseResponse(response);
}
