FROM node:7
MAINTAINER Stepan Kuzmin <to.stepan.kuzmin@gmail.com>

RUN echo 'deb http://ftp.us.debian.org/debian testing main contrib non-free' >> /etc/apt/sources.list.d/testing.list \
  && echo 'Package: *\nPin: release a=testing\nPin-Priority: 100' >> /etc/apt/preferences.d/testing \
  && apt-get -yqq update \
  && apt-get install -yqq -t testing gcc

ENV NPM_CONFIG_COLOR=false
ENV NPM_CONFIG_LOGLEVEL=warn

RUN npm i -g pm2
RUN mkdir -p /usr/src/app /data /extracts
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn
COPY profiles/* /usr/src/app/node_modules/osrm/profiles/

EXPOSE 4000
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
