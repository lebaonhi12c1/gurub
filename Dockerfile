# Set the base image for subsequent instructions
FROM php:7.4-alpine

# Update packages
RUN apk update

# Install PHP and composer dependencies
RUN apk add --no-cache \
    git \
    curl \
    zip \
    unzip \
    openssh-client

# Install Composer
RUN curl --silent --show-error "https://getcomposer.org/installer" | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel Envoy
RUN composer global require "laravel/envoy=^2.8" "vlucas/phpdotenv=^5.5"