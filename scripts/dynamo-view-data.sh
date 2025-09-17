#!/bin/bash

ENDPOINT_URL="http://localhost:8000"
REGION="us-east-1"
TABLE_NAME="linkinho-backend-urls-dev"

echo "🔍 Visualizando dados do DynamoDB Local..."
echo "================================================"

echo "===== Contagem de itens ====="
aws dynamodb scan \
    --table-name $TABLE_NAME \
    --select "COUNT" \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION \
    --output table

echo ""

echo "===== Últimos 5 itens criados ====="
aws dynamodb scan \
    --table-name $TABLE_NAME \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION \
    --limit 5 \
    --output json | jq '.Items[] | {shortCode: .shortCode.S, originalUrl: .originalUrl.S, createdAt: .createdAt.S}'