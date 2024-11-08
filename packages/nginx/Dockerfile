FROM ghcr.io/alwatr/nginx-json:3.2.0

LABEL org.opencontainers.image.base.name="ghcr.io/alwatr/nginx-json:3.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --start-interval=1s --retries=3 CMD curl -fso /dev/null --header 'authorization: Alwatr healthcheck:healthcheck' http://localhost/server-info || exit 1

RUN rm -fv /etc/nginx/templates/location.d/90-home-json.conf.template
COPY etc/nginx/ /etc/nginx/
COPY default-data/ /default-data/
RUN ls -RlahF /etc/nginx /default-data /data

ENV NGINX_DOCUMENT_ROOT=/data \
    NGINX_OPEN_FILE_CACHE="max=5000 inactive=1h" \
    NGINX_OPEN_FILE_CACHE_VALID=1s \
    NGINX_OPEN_FILE_CACHE_MIN_USES=2 \
    NGINX_OUTPUT_BUFFERS="8 8k" \
    NGINX_EXPIRES_DYNAMIC=epoch \
    NGINX_EXPIRES_STATIC=max \
    NGINX_EXPIRES_DEFAULT=epoch \
    NGINX_LIMIT_REQ_RATE=400 \
    NGINX_LIMIT_REQ_BURST=1000 \
    NGINX_DISABLE_SYMLINKS=if_not_owner

ENV nitrobaseApiPrefix="/api/s7" \
    nitrobaseDebugPath="/debug-info-110" \
    nitrobaseRegionPublic="p" \
    nitrobaseRegionSecret=".s" \
    nitrobaseRegionAuthenticated="a" \
    nitrobaseRegionManagers="m" \
    nitrobaseRegionPerUser="u" \
    nitrobaseRegionPerOwner="o"
