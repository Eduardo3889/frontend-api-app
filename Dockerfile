FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG VITE_API_URL=/api
ARG VITE_AUTH_LOGIN_PATH=/auth/login
ARG VITE_AUTH_ME_PATH=/auth/me
ARG VITE_USERS_PATH=/users
ARG VITE_ITEMS_PATH=/items
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_LOGIN_PATH=$VITE_AUTH_LOGIN_PATH
ENV VITE_AUTH_ME_PATH=$VITE_AUTH_ME_PATH
ENV VITE_USERS_PATH=$VITE_USERS_PATH
ENV VITE_ITEMS_PATH=$VITE_ITEMS_PATH
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
