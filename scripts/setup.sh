#!/usr/bin/env bash
# Development setup script for NeuralBay Gateway

echo "🚀 Setting up NeuralBay Gateway development environment..."

# Backend setup
echo "📦 Setting up backend..."
cd backend
go mod tidy
echo "✅ Backend ready"

# Frontend setup
echo "📦 Setting up frontend..."
cd ../web
npm install
echo "✅ Frontend ready"

# Environment setup
echo "🔧 Setting up environment..."
cd ..
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env created from .env.example"
    echo "⚠️  Please edit .env with your configuration"
fi

echo ""
echo "🎉 Development environment ready!"
echo ""
echo "To start:"
echo "  Terminal 1: cd backend && go run main.go"
echo "  Terminal 2: cd web && npm run dev"
echo ""
echo "Access: http://localhost:3000 (API) / http://localhost:3001 (Dashboard)"
