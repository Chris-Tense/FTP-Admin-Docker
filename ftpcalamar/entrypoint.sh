#!/bin/bash

mkdir -p /data/storage
mkdir -p /data/certs
mkdir -p /data/logs

if [ ! -f /data/certs/server.crt ]; then

openssl req \
-x509 \
-nodes \
-newkey rsa:4096 \
-days 3650 \
-subj "/CN=fileportal.local" \
-keyout /data/certs/server.key \
-out /data/certs/server.crt

fi

# Crear usuario admin Linux si no existe

id admin >/dev/null 2>&1 || useradd -m admin

echo "admin:admin" | chpasswd

mkdir -p /data/storage/admin

chown -R admin:admin /data/storage/admin

exec /usr/bin/supervisord -n \
-c /etc/supervisor/conf.d/supervisord.conf
