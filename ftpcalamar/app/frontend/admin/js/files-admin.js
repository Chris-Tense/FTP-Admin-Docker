const currentUser =
    localStorage.getItem("user");

if (currentUser !== "admin") {

    location.replace(
        "/admin/dashboard-cliente.html"
    );

}

async function loadFiles() {

    const response =
        await fetch(
            "/api/admin/files",
            {
                headers: {
                    "x-user": currentUser
                }
            }
        );

    const files =
        await response.json();

    const div =
        document.getElementById("files");

    div.innerHTML = "";

    const users = {};

    files.forEach(item => {

        if (!users[item.user]) {
            users[item.user] = [];
        }

        users[item.user].push(item);

    });

    Object.keys(users).forEach(username => {

        const card =
            document.createElement("div");

        card.className = "card";

        const title =
            document.createElement("h3");

        title.textContent =
            `👤 ${username}`;

        card.appendChild(title);

        const userDiv =
            document.createElement("div");

        card.appendChild(userDiv);

        div.appendChild(card);

        users[username].forEach(item => {

            const row =
                document.createElement("div");

            row.innerHTML = `
                <div style="margin:8px 0">

                    📄 ${item.file}

                    <br>

                    📏 ${formatSize(item.size)}

                    <br>

                    📅 ${new Date(item.uploaded)
                        .toLocaleString("es-AR")}

                    <br>

                    <button class="download-btn">
                        ⬇ Descargar
                    </button>

                    <button class="delete-btn">
                        ❌ Eliminar
                    </button>

                </div>
            `;

            row
                .querySelector(".download-btn")
                .addEventListener(
                    "click",
                    () => downloadFile(
                        username,
                        item.file
                    )
                );

            row
                .querySelector(".delete-btn")
                .addEventListener(
                    "click",
                    () => deleteFile(
                        username,
                        item.file
                    )
                );

            userDiv.appendChild(row);

        });

    });

}

async function deleteFile(
    targetUser,
    file
) {

    console.log(
        "DELETE",
        targetUser,
        file
    );

    if (
        !confirm(
            `Eliminar ${file}?`
        )
    ) {
        return;
    }

    const url =
        `/api/admin/files/${targetUser}/${encodeURIComponent(file)}`;

    const response =
        await fetch(
            url,
            {
                method: "DELETE",
                headers: {
                    "x-user": currentUser
                }
            }
        );

    const data =
        await response.json();

    alert(
        data.message
    );

    loadFiles();

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

function downloadFile(
    targetUser,
    file
) {

    window.open(
        `/api/admin/files/download/${targetUser}/${encodeURIComponent(file)}`,
        "_blank"
    );

}

loadFiles();
