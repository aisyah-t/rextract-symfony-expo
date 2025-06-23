FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
 git \
 curl \
 libpng-dev \
 libxml2-dev \
 zip \
 unzip \
 postgresql-dev \
 icu-dev \
 oniguruma-dev \
 freetype-dev \
 libjpeg-turbo-dev \
 libwebp-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install \
 pdo \
 pdo_pgsql \
 mbstring \
 exif \
 pcntl \
 bcmath \
 gd \
 intl \
 xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create cache and logs directories
RUN mkdir -p var/cache var/log \
 && chmod -R 777 var/cache var/log

# Expose port 9000 for FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"] 