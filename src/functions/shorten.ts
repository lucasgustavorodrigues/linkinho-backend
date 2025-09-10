import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShortenController } from "../controllers/shorten-controller";

export async function handler(event: APIGatewayProxyEventV2) {
  const body = JSON.parse(event.body ?? "{}");
  const params = event.pathParameters ?? {};
  const queryParams = event.queryStringParameters ?? {};

  await ShortenController.handle({
    body,
    params,
    queryParams,
  });
}
