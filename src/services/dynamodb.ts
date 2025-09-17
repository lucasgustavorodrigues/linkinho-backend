import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const isLocalDevelopment = process.env.NODE_ENV === "development" || process.env.IS_OFFLINE === "true";

const client = new DynamoDBClient({
	region: process.env.AWS_REGION || "us-east-1",
	// DynamoDB Local configuration
	...(isLocalDevelopment && {
		endpoint: "http://localhost:8000",
		credentials: {
			accessKeyId: "test",
			secretAccessKey: "test",
		},
	}),
});

if (isLocalDevelopment) {
	console.log("✅ Using DynamoDB Local (localhost:8000)");
} else {
	console.log("☁️ Using AWS DynamoDB");
}

export const dynamoDb = DynamoDBDocumentClient.from(client, {
	marshallOptions: {
		removeUndefinedValues: true,
		convertEmptyValues: true,
	},
});

export const TABLE_NAME = process.env.URLS_TABLE || "linkinho-backend-urls-dev";
