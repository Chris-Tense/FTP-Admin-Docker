# 🐙 FTPCalamar

FTPCalamar es una plataforma de almacenamiento de archivos basada en Docker que combina:

- 🌐 Interfaz web HTTPS
- 📁 Gestión de archivos
- 👥 Administración de usuarios
- ⬆️ Subida y descarga de archivos
- 🔐 SSH / SFTP
- 📡 FTP (vsftpd)
- 🐳 Despliegue mediante Docker

---

# Características

✅ Gestión de usuarios desde la web

✅ Panel de administración

✅ Panel de usuario

✅ Carga de archivos

✅ Descarga de archivos

✅ Eliminación de archivos

✅ Visualización de logs

✅ Soporte para:

- PDF
- JPG
- PNG
- MP3
- MP4
- ZIP
- RAR
- y cualquier otro tipo de archivo

✅ FTP y SFTP habilitados

✅ HTTPS con certificados SSL

---

# Requisitos

- Docker
- Docker Compose

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Chris-Tense/ftpcalamar.git
cd ftpcalamar

# Docker Compose

Crear un archivo llamado `docker-compose.yml`:

services:

  ftpcalamar:

    image: christense/ftpcalamar:latest

    container_name: ftpcalamar

    hostname: ftpcalamar

    restart: unless-stopped

    ports:
      - "80:80"
      - "443:443"
      - "21:21"
      - "2222:22"
      - "30000-30100:30000-30100"

    volumes:
      - ./data/storage:/data/storage
      - ./data/logs:/data/logs
      - ./data/certs:/data/certs
      - ./data/config:/data/config

    environment:
      TZ: America/Argentina/Buenos_Aires
```

## Instalación rápida

Crear el directorio de trabajo:

```bash
mkdir ftpcalamar
cd ftpcalamar
```

Crear las carpetas necesarias:

```bash
mkdir -p data/storage
mkdir -p data/logs
mkdir -p data/certs
mkdir -p data/config
```

Crear el archivo:

```bash
nano docker-compose.yml
```

Pegar el contenido mostrado anteriormente.

Iniciar FTPCalamar:

```bash
docker compose up -d
```

Verificar el estado:

```bash
docker ps
```

Ver logs:

```bash
docker logs -f ftpcalamar
```

Detener FTPCalamar:

```bash
docker compose down
```

## Docker Hub

Descargar la imagen:

```bash
docker pull christense/ftpcalamar:latest
```

## Acceso

Portal Web:

```text
https://IP_DEL_SERVIDOR
```

FTP:

```text
ftp://IP_DEL_SERVIDOR
```

SFTP:

```text
sftp://USUARIO@IP_DEL_SERVIDOR:2222
```

## Puertos utilizados

| Servicio | Puerto |
|-----------|---------|
| HTTP | 80 |
| HTTPS | 443 |
| FTP | 21 |
| SSH/SFTP | 2222 |
| FTP Passive | 30000-30100 |

## Volúmenes persistentes

Los siguientes directorios permanecen aunque el contenedor sea eliminado:

```text
/data/storage
/data/logs
/data/certs
/data/config
```

Esto permite conservar:

- Archivos de los usuarios
- Configuración
- Certificados SSL
- Logs del sistema

## Docker 

docker compose down

docker pull christense/ftpcalamar:latest

docker compose up -d

