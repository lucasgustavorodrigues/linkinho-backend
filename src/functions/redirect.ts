import { APIGatewayProxyEventV2 } from "aws-lambda";
import { RedirectController } from "../controllers/redirect-controller";

export async function handler(event: APIGatewayProxyEventV2) {
  const body = JSON.parse(event.body ?? "{}");
  const params = event.pathParameters ?? {};
  const queryParams = event.queryStringParameters ?? {};

  await RedirectController.handle({
    body,
    params,
    queryParams,
  });
}
