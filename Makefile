.PHONY: start dev build rebuild reset migrate seed help

# Default target
help:
	@echo "Available commands:"
	@echo "  make start         # Start the application in production mode"
	@echo "  make dev           # Start the application in development mode"
	@echo "  make build         # Build the application"
	@echo "  make rebuild       # Rebuild containers without affecting the database"
	@echo "  make reset         # Reset everything including the database"
	@echo "  make migrate       # Run database migrations"
	@echo "  make seed          # Seed the database"
	@echo "  make logs          # View logs"
	@echo "  make help          # Show this help message"

# Start the application in production mode
start:
	docker compose up -d

# Start the application in development mode
dev:
	docker compose exec app npm run dev

# Build the application
build:
	docker compose build

# Rebuild containers without affecting the database
rebuild:
	@echo "Stopping containers..."
	docker compose stop
	@echo "Rebuilding app container..."
	docker compose build app
	@echo "Starting containers..."
	docker compose up -d
	@echo "Build completed. Your database data has been preserved."
	@echo "Access your app at http://localhost:3001"

# Reset everything including the database
reset:
	@echo "WARNING: This will delete all your data and reset the database."
	@read -p "Are you sure you want to continue? (y/n) " confirm; \
	if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
		echo "Operation canceled."; \
		exit 1; \
	fi
	@echo "Stopping and removing everything..."
	docker compose down -v
	@echo "Rebuilding and starting from scratch..."
	docker compose up -d --build
	@echo "Waiting for MySQL to start (this may take a minute)..."
	@sleep 15
	@echo "Running migrations and seed data..."
	$(MAKE) migrate
	$(MAKE) seed
	@echo "Reset completed. Your application has been fully reset with fresh database."
	@echo "Access your app at http://localhost:3001"

# Run database migrations
migrate:
	docker compose exec app npm run db:migrate

# Seed the database
seed:
	docker compose exec app npm run db:seed

# View logs
logs:
	docker compose logs -f
