FROM node:15.8 AS cevin-web

WORKDIR /opt/ng
COPY ./ ./

RUN npm install -g @angular/cli
RUN npm install

COPY ./ ./
RUN ng build --prod

FROM nginx
COPY --from=cevin-web /opt/ng/dist/Cevin-Tracking /usr/share/nginx/html
EXPOSE 80

# USE
# docker build -t cevin-web .
# docker run --name cevin-web -d -p 8080:80 cevin-web
