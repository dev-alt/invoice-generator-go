#!/bin/bash

set -e

echo "Waiting for database..."
until pg_isready -h db -U invoice_user -d invoice_db
do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "Running database migrations..."
migrate -database "${POSTGRES_URL}" -path ./migrations up

exit_code=$?
if [ $exit_code -eq 0 ]; then
    echo "Migrations completed successfully"
    exit 0
else
    echo "Migration failed with exit code $exit_code"
    exit 1
fi