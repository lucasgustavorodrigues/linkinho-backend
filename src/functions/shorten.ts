import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShortenController } from "../controllers/shorten-controller";
import { parseEvent } from "../utils/parse-event";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)

  await ShortenController.handle(request);
}
