#!/bin/bash
set -e

echo "Waiting for database to be ready..."
while ! pg_isready -h db -p 5433 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

echo "Running database migrations..."
flask db upgrade || echo "Migration failed or no migrations to run"

echo "Starting application..."
exec "$@"