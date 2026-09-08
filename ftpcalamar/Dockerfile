FROM debian:13

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
    nginx \
    openssh-server \
    vsftpd \
    supervisor \
    curl \
    wget \
    unzip \
    openssl \
    sudo \
    ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

RUN mkdir -p \
    /data/storage \
    /data/logs \
    /data/certs \
    /data/config \
    /var/run/sshd

COPY app /app

COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/ssh/sshd_config /etc/ssh/sshd_config
COPY config/vsftpd/vsftpd.conf /etc/vsftpd.conf

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /entrypoint.sh

WORKDIR /app/backend

RUN npm install

RUN chmod +x /entrypoint.sh

EXPOSE 80
EXPOSE 443
EXPOSE 21
EXPOSE 22
EXPOSE 3000
EXPOSE 30000-30100

ENTRYPOINT ["/entrypoint.sh"]
