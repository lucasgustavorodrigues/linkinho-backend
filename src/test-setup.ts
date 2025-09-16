import { vi } from "vitest";

// Mock do AWS SDK DynamoDB
vi.mock("@aws-sdk/lib-dynamodb", () => ({
	DynamoDBDocumentClient: {
		from: vi.fn().mockReturnValue({
			send: vi.fn(),
		}),
	},
	GetCommand: vi.fn(),
	PutCommand: vi.fn(),
	UpdateCommand: vi.fn(),
}));

vi.mock("@aws-sdk/client-dynamodb", () => ({
	DynamoDBClient: vi.fn().mockImplementation(() => ({
		send: vi.fn(),
	})),
}));

// Mock das variáveis de ambiente
process.env.AWS_REGION = "us-east-1";
process.env.DYNAMODB_TABLE_NAME = "test-table";
