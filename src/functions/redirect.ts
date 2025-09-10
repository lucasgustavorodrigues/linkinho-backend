import { APIGatewayProxyEventV2 } from "aws-lambda";
import { RedirectController } from "../controllers/redirect-controller";
import { parseEvent } from "../utils/parse-event";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event)

  await RedirectController.handle(request);
}
