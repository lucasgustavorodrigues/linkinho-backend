import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, TABLE_NAME } from "./dynamodb.js";

export interface UrlRecord {
	shortCode: string;
	originalUrl: string;
	createdAt: string;
	clickCount: number;
	ttl?: number;
}

export class UrlService {
	static async createShortUrl(shortCode: string, originalUrl: string): Promise<UrlRecord> {
		const now = new Date().toISOString();

		const urlRecord: UrlRecord = {
			shortCode,
			originalUrl,
			createdAt: now,
			clickCount: 0,
			// ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
		};

		const params = {
			TableName: TABLE_NAME,
			Item: urlRecord,
			// Condicional: fails if shortCode already exists
			ConditionExpression: "attribute_not_exists(shortCode)",
		};

		try {
			await dynamoDb.send(new PutCommand(params));
			return urlRecord;
		} catch (error: unknown) {
			if (
				error &&
				typeof error === "object" &&
				"name" in error &&
				error.name === "ConditionalCheckFailedException"
			) {
				throw new Error("Short code already exists");
			}
			throw error;
		}
	}

	static async getUrlByShortCode(shortCode: string): Promise<UrlRecord | null> {
		const params = {
			TableName: TABLE_NAME,
			Key: { shortCode },
		};

		const result = await dynamoDb.send(new GetCommand(params));
		return (result.Item as UrlRecord) || null;
	}

	static async incrementClickCount(shortCode: string): Promise<void> {
		const params = {
			TableName: TABLE_NAME,
			Key: { shortCode },
			UpdateExpression: "ADD clickCount :inc",
			ExpressionAttributeValues: {
				":inc": 1,
			},
			// Only update, if the item exists
			ConditionExpression: "attribute_exists(shortCode)",
		};

		try {
			await dynamoDb.send(new UpdateCommand(params));
		} catch (error: unknown) {
			if (
				error &&
				typeof error === "object" &&
				"name" in error &&
				error.name === "ConditionalCheckFailedException"
			) {
				throw new Error("URL not found");
			}
			throw error;
		}
	}
}
