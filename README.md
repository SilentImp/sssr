# How to run local
1. Create file local.js in config/webpack && config/app
2. Copy content from local.sample.js to local.js
3. npm install
4. npm start
5. open localhost:3030 or yourIP:3030 in browser

# How to build
local - npm run build:local
local with ssr - npm run build:localssr
dev - npm run build:dev
production - npm run build

# How test build
1. npm run build:yourENV
2. serve -s public
3. open localhost:5000 or yourIP:5000 in browser

# How to run tests (without coverage report)
npm run test (or npm t)

# How to run tests (with coverage report)
npm run test-coverage


# NGINX configuration

    upstream storefront {
      server 127.0.0.1:3006;
    }

    server {
      listen *:80;
      listen [::]:80;

      gzip on;
      gzip_comp_level 7;
      gzip_disable "msie6";
      gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

      error_log /path/storefront.error.log; #p
      access_log /path/storefront.access.log; #p

      server_name sf;

      location / {
        root /path/Plasma-Storefront-SSR/build/;
        try_files $uri @node;
      }

      location @node {
        proxy_pass http://storefront;
        proxy_redirect off;
        proxy_set_header Host $host ;
        proxy_set_header X-Real-IP $remote_addr ;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for ;
        proxy_set_header X-Forwarded-Proto http;
      }
    }
