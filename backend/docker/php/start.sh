#!/bin/sh

# Run Composer post-install scripts (cache:clear, etc.) when container starts
# This ensures DATABASE_URL and other environment variables are available
echo "Running Composer post-install scripts..."
composer run-script post-install-cmd

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm 