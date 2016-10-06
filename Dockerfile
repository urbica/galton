FROM ubuntu:16.04
MAINTAINER Stepan Kuzmin <to.stepan.kuzmin@gmail.com>

RUN apt-get -yqq update
RUN \
  apt-get -yqq install build-essential git cmake pkg-config \
  libbz2-dev libstxxl-dev libstxxl1v5 libxml2-dev \
  libzip-dev libboost-all-dev lua5.1 liblua5.1-0-dev libluabind-dev libtbb-dev curl

# gpg keys listed at https://github.com/nodejs/node
RUN set -ex \
  && for key in \
    9554F04D7259F04124DE6B476D5A82AC7E37093B \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
  done

ENV NODE_ENV production
ENV NODE_VERSION 4.6.0
ENV NPM_CONFIG_LOGLEVEL warn

ENV OSRM_VERSION 5.4.0
ENV GALTON_VERSION 1.3.6

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN mkdir -p /data
RUN mkdir -p /srv/galton
WORKDIR /srv/galton
RUN curl -OL "https://github.com/Project-OSRM/osrm-backend/archive/v$OSRM_VERSION.tar.gz"
RUN tar -xzf v$OSRM_VERSION.tar.gz
RUN cp -r osrm-backend-$OSRM_VERSION/profiles /data/
RUN rm v$OSRM_VERSION.tar.gz
RUN mkdir -p osrm-backend-$OSRM_VERSION/build
WORKDIR /srv/galton/osrm-backend-$OSRM_VERSION/build
RUN cmake .. -DCMAKE_BUILD_TYPE=Release
RUN cmake --build .
RUN cmake --build . --target install
WORKDIR /data
RUN rm -rf /srv/galton/osrm-backend-$OSRM_VERSION
RUN npm install galton@$GALTON_VERSION
# RUN npm install -g galton@$GALTON_VERSION

COPY run.sh run.sh

EXPOSE 4000
VOLUME /data

ENTRYPOINT ["/data/run.sh"]
CMD ["bash", "run.sh"]
