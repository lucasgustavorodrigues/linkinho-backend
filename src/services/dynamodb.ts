import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
	region: process.env.AWS_REGION || "us-east-1",
	// LocalStack configuration
	...(process.env.NODE_ENV === "development" && {
		endpoint: "http://localhost:4566",
		credentials: {
			accessKeyId: "test",
			secretAccessKey: "test",
		},
	}),
	// Serverless offline configuration
	...(process.env.IS_OFFLINE && {
		endpoint: "http://localhost:4566",
		credentials: {
			accessKeyId: "test",
			secretAccessKey: "test",
		},
	}),
});

export const dynamoDb = DynamoDBDocumentClient.from(client, {
	marshallOptions: {
		removeUndefinedValues: true,
		convertEmptyValues: true,
	},
});

export const TABLE_NAME = process.env.URLS_TABLE || "linkinho-backend-urls-dev";
