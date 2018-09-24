FROM node:8-slim
LABEL maintainer="Stepan Kuzmin <to.stepan.kuzmin@gmail.com>"

ENV PATH /usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app
COPY . .
RUN yarn global add file:/usr/src/app

WORKDIR /data
ENTRYPOINT [ "galton" ]