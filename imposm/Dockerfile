FROM golang:1.14

ARG IMPOSM_REPO="https://github.com/omniscale/imposm3.git"
ARG IMPOSM_VERSION="v0.11.0"

# Build imposm
RUN set -eux ;\
    DEBIAN_FRONTEND=noninteractive apt-get update ;\
    DEBIAN_FRONTEND=noninteractive apt-get install  -y \
        `# installing imposm dependencies` \
        libgeos-dev \
        libleveldb-dev \
        libprotobuf-dev \
        protobuf-compiler \
        ;\
    \
    apt list --installed ;\
    \
    go version ;\
    go get github.com/tools/godep ;\
    mkdir /build-bin ;\
    git clone --quiet --depth 1 $IMPOSM_REPO -b $IMPOSM_VERSION \
        $GOPATH/src/github.com/omniscale/imposm3 ;\
    cd $GOPATH/src/github.com/omniscale/imposm3 ;\
    make build ;\
    mv imposm /usr/bin/imposm

ENTRYPOINT ["imposm"]
