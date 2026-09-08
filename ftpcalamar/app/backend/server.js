const express = require("express");
const helmet = require("helmet");
const path = require("path");
const app = express();
const fs = require("fs");
const { execSync } = require("child_process");
const multer = require("multer");
const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            const user =
                req.headers["x-user"];

            cb(
                null,
                `/data/storage/${user}`
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            const filename = Buffer
                .from(
                    file.originalname,
                    "latin1"
                )
                .toString("utf8");

            cb(
                null,
                filename
            );

        }

    });

const upload = multer({
    storage
});

function requireAdmin(req, res) {

    const currentUser =
        req.headers["x-user"];

    if (currentUser !== "admin") {

        res.status(403).json({
            success: false,
            message: "Acceso denegado"
        });

        return false;

    }

    return true;

}

app.use(helmet());
app.use(express.json());

app.use(
    express.static("/app/frontend")
);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            "/app/frontend",
            "login.html"
        )
    );
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        version: "0.1"
    });
});

app.listen(3000, () => {
    console.log("FilePortal iniciado");
});

app.post("/api/auth/login", (req, res) => {

    const { username } = req.body;

    try {

        const users = fs
            .readdirSync("/data/storage");

        if (users.includes(username)) {

            return res.json({
                success: true,
                message: "Login correcto",
                user: username,
                isAdmin: username === "admin"
            });

        }

        return res.status(401).json({
            success: false,
            message: "Usuario no existe"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.post("/api/users", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    const {
        username,
        password,
        quota
    } = req.body;

    try {

        execSync(
            `id ${username}`,
            {
                stdio: "ignore"
            }
        );

        return res.status(400).json({
            success: false,
            message: "Usuario ya existe"
        });

    } catch {}

    try {

        execSync(
            `useradd -m ${username}`
        );

        execSync(
            `echo '${username}:${password}' | chpasswd`
        );

        execSync(
            `mkdir -p /data/storage/${username}`
        );

        execSync(
            `chown -R ${username}:${username} /data/storage/${username}`
        );

        return res.json({
            success: true,
            message: "Usuario creado"
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.get("/api/users", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    try {

        const users = fs
            .readdirSync("/data/storage", {
                withFileTypes: true
            })
            .filter(item => item.isDirectory())
            .map(item => item.name);

        res.json(users);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.delete("/api/users/:username", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    const username =
        req.params.username;

    if (username === "admin") {

        return res.status(400).json({
            success: false,
            message: "No se puede eliminar admin"
        });

    }

    try {

        execSync(`userdel -r ${username}`);

    } catch {}

    try {

        execSync(
            `rm -rf /data/storage/${username}`
        );

    } catch {}

    res.json({
        success: true,
        message: "Usuario eliminado"
    });

});

app.get("/api/files", (req, res) => {

    const user =
        req.headers["x-user"];

    const basePath =
        `/data/storage/${user}`;

    try {

        const items =
            fs.readdirSync(
                basePath,
                {
                    withFileTypes: true
                }
            );

        const files =
            items.map(item => {

                const stats =
                    fs.statSync(
                        `${basePath}/${item.name}`
                    );

                return {

                    name: item.name,

                    type: item.isDirectory()
                        ? "folder"
                        : "file",

                    size: stats.size,

                    uploaded: stats.mtime

                };

            });

        res.json(files);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


app.post("/api/files/upload", upload.single("file"), (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se subió ningún archivo." });
        }

        res.json({
            success: true,
            file: req.file 
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


app.delete(
    "/api/files/:name",
    (req, res) => {

        const user =
            req.headers["x-user"];

        const file =
            `/data/storage/${user}/${req.params.name}`;

        try {

            fs.rmSync(
                file,
                {
                    recursive: true,
                    force: true
                }
            );

            return res.json({
                success: true,
                message: "Archivo eliminado"
            });

        } catch (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }
);

app.get("/api/logs", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    try {

        const logs = fs.readFileSync(
            "/var/log/nginx/access.log",
            "utf8"
        );

        res.send(logs);

    } catch (err) {

        res.send(
            "Sin logs disponibles"
        );

    }

});

app.delete("/api/logs", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    try {

        fs.truncateSync(
            "/var/log/nginx/access.log",
            0
        );

        res.json({
            success: true,
            message: "Logs eliminados"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

app.get("/api/admin/files", (req, res) => {

    if (!requireAdmin(req, res)) {
        return;
    }

    try {

        const users = fs
            .readdirSync("/data/storage", {
                withFileTypes: true
            })
            .filter(item => item.isDirectory());

        const result = [];

        users.forEach(user => {

            const userPath =
                `/data/storage/${user.name}`;

            const files =
                fs.readdirSync(userPath);

            files.forEach(file => {

                const stats = fs.statSync(
                    `${userPath}/${file}`
                );

                result.push({

                    user: user.name,

                    file: file,

                    size: stats.size,

                    uploaded: stats.mtime

                });

            });

        });

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.delete(
    "/api/admin/files/:user/:file",
    (req, res) => {

        if (!requireAdmin(req, res)) {
            return;
        }

        const user = req.params.user;

        const file = decodeURIComponent(
            req.params.file
        );

        const filePath =
            `/data/storage/${user}/${file}`;

        try {

            fs.rmSync(
                filePath,
                {
                    force: true
                }
            );

            return res.json({
                success: true,
                message: "Archivo eliminado"
            });

        } catch (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }
);

app.get(
    "/api/admin/files/download/:user/:file",
    (req, res) => {

        const user =
            req.params.user;

        const file =
            decodeURIComponent(
                req.params.file
            );

        const filePath =
            `/data/storage/${user}/${file}`;

        res.download(filePath);

    }
);

app.get(
    "/api/files/download/:user/:file",
    (req, res) => {

        const filePath =
            `/data/storage/${req.params.user}/${decodeURIComponent(req.params.file)}`;

        res.download(filePath);

    }
);
