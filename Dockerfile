FROM node:4-alpine
MAINTAINER Stepan Kuzmin <to.stepan.kuzmin@gmail.com>

ENV NPM_CONFIG_COLOR=false
ENV NPM_CONFIG_LOGLEVEL=warn

RUN yarn global add pm2
RUN mkdir -p /usr/src/app /data /extracts
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn
COPY profiles/* /usr/src/app/node_modules/osrm/profiles/

EXPOSE 4000
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
