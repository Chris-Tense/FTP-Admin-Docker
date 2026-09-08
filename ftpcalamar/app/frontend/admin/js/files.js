const currentUser = localStorage.getItem("user");

const isAdminPage =
    window.location.pathname.includes("/admin/dashboard.html");

if (isAdminPage && currentUser !== "admin") {
    location.replace("/admin/dashboard-cliente.html");
}

function formatSize(bytes) {

    if (bytes < 1024)
        return `${bytes} B`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;

    if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;

    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;

}

async function loadFiles() {

    const user =
        localStorage.getItem("user");

    const response = await fetch(
        "/api/files",
        {
            headers: {
                "x-user": user
            }
        }
    );

    const files = await response.json();

    const div = document.getElementById("files");

    div.innerHTML = "";

    files.forEach(file => {

        const icon =
            file.type === "folder"
                ? "📁"
                : "📄";

        const row = document.createElement("div");

        row.innerHTML = `

            <div class="card">

                ${icon} ${file.name}

                <br>

                📏 ${formatSize(file.size)}

                <br>

                📅 ${new Date(file.uploaded)
                    .toLocaleString("es-AR")}

                <br><br>

                <button class="download-btn">
                    ⬇ Descargar
                </button>

                <button class="delete-btn">
                    ❌ Eliminar
                </button>

            </div>

        `;

        row
            .querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => deleteFile(file.name)
            );

        row
            .querySelector(".download-btn")
            .addEventListener(
                "click",
                () => downloadFile(
                    file.name
                )
            );

        div.appendChild(row);

    });

}

async function uploadFile() {

    const file =
        document.getElementById("uploadFile").files[0];

    if (!file) {

        alert("Seleccione un archivo");

        return;

    }

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const user =
        localStorage.getItem("user");

    const response = await fetch(
        "/api/files/upload",
        {
            method: "POST",
            headers: {
                "x-user": user
            },
            body: formData
        }
    );

    const data = await response.json();

    if (data.success) {

        alert("Archivo subido correctamente");

        document.getElementById(
            "uploadFile"
        ).value = "";

        await loadFiles();

    } else {

        alert("Error al subir archivo");

    }

}

async function deleteFile(name) {

    if (!confirm(`Eliminar ${name}?`)) {
        return;
    }

    const user =
        localStorage.getItem("user");

    await fetch(
        `/api/files/${name}`,
        {
            method: "DELETE",
            headers: {
                "x-user": user
            }
        }
    );

    await loadFiles();

}

function downloadFile(name) {

    const user =
        localStorage.getItem("user");

    window.open(
        `/api/files/download/${user}/${encodeURIComponent(name)}`,
        "_blank"
    );

}

async function loadQuota() {

    const user =
        localStorage.getItem("user");

    const response =
        await fetch(
            "/api/quota",
            {
                headers: {
                    "x-user": user
                }
            }
        );

    const data =
        await response.json();

    document.getElementById(
        "quotaInfo"
    ).innerHTML = `

        💾 Usado:
        ${formatSize(data.used)}

        <br>

    `;
}

document
    .getElementById("uploadBtn")
    .addEventListener(
        "click",
        uploadFile
    );

document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        loadFiles
    );

window.loadFiles = loadFiles;
window.uploadFile = uploadFile;

loadFiles();
loadQuota();
