FROM node:7
MAINTAINER Stepan Kuzmin <to.stepan.kuzmin@gmail.com>

RUN echo 'deb http://ftp.us.debian.org/debian testing main contrib non-free' >> /etc/apt/sources.list.d/testing.list \
  && echo 'Package: *\nPin: release a=testing\nPin-Priority: 100' >> /etc/apt/preferences.d/testing \
  && apt-get -yqq update \
  && apt-get install -yqq -t testing gcc \
    build-essential git cmake pkg-config \
    libbz2-dev libstxxl-dev libstxxl1v5 libxml2-dev \
    libzip-dev libboost-all-dev lua5.2 liblua5.2-dev libtbb-dev

ENV NPM_CONFIG_COLOR=false
ENV NPM_CONFIG_LOGLEVEL=warn

RUN npm i -g pm2
RUN mkdir -p /usr/src/app /data /extracts

WORKDIR /tmp
COPY package.json .
RUN yarn

WORKDIR /usr/src/app
RUN cp -R /tmp/node_modules .
COPY . /usr/src/app
COPY profiles/* /usr/src/app/node_modules/osrm/profiles/

EXPOSE 4000
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
