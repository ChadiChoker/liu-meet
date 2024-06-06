# LIU Meet

This is a group video calling app with `Laravel` and `reactjs` using `websocket` and `WebRTC` technology 

## Prerequisites

# Manual 

- [x] php 8.1 or above
- [x] MYSQL 5.7 or above
- [x] Nginx
- [x] NPM 8 or above
- [x] COMPOSER
- [x] Node.js 18 or above

# Via Laravel Herd
## Install Laravel Herd
   `Install via:` [Laravel Herd](https://herd.laravel.com/docs/1/getting-started/installation)

## Features

- [x] group `video call`
- [x] Audio `Mute/Unmute` and Video `hide/show`
- [x] `Screen sharing`
- [x] Retry when switch B/W `network` (mobile network to wifi or if wifi restart call will try to reconnect.)

## How run the application Manually


- copy `.env.local.example` to `.env.local` file with correct data
- Install dependencies

```bash
composer install
npm install
npm run prod
```

- run `migrate` command

```bash
php artisan migrate 
```


- Run the application

```bash
php artisan serve
```


## How run the application via Laravel Herd

- How to serve site via Laravel Herd (https://herd.laravel.com/docs/1/getting-started/paths)

