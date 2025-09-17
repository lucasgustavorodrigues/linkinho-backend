#!/bin/bash

# Configurações
ENDPOINT_URL="http://localhost:8000"
REGION="us-east-1"
TABLE_NAME="linkinho-backend-urls-dev"

echo "Aguardando DynamoDB Local..."
sleep 5

echo "DynamoDB Local está pronto! Criando tabela DynamoDB..."

# Criar tabela DynamoDB com sintaxe correta
aws dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions \
        AttributeName=shortCode,AttributeType=S \
        AttributeName=createdAt,AttributeType=S \
    --key-schema \
        AttributeName=shortCode,KeyType=HASH \
    --global-secondary-indexes \
        '[
            {
                "IndexName": "CreatedAtIndex",
                "KeySchema": [
                    {
                        "AttributeName": "createdAt",
                        "KeyType": "HASH"
                    }
                ],
                "Projection": {
                    "ProjectionType": "ALL"
                },
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 5,
                    "WriteCapacityUnits": 5
                }
            }
        ]' \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Tabela DynamoDB criada com sucesso!"
else
    echo "❌ Erro ao criar tabela. Verificando se já existe..."
fi

echo "Verificando tabelas disponíveis:"
aws dynamodb list-tables \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION

echo "Descrevendo a tabela criada:"
aws dynamodb describe-table \
    --table-name $TABLE_NAME \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION \
    --query 'Table.{TableName:TableName,Status:TableStatus,ItemCount:ItemCount}' || echo "Tabela não encontrada"