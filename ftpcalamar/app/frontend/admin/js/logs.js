const user =
    localStorage.getItem("user");

if (user !== "admin") {

    location.replace(
        "/admin/dashboard-cliente.html"
    );

}

async function loadLogs() {

    const response =
        await fetch(
            "/api/logs",
            {
                headers: {
                    "x-user": user
                }
            }
        );

    const data =
        await response.text();

    document.getElementById(
        "logs"
    ).textContent = data;

}

async function clearLogs() {

    if (
        !confirm(
            "¿Eliminar todos los logs?"
        )
    ) {
        return;
    }

    const response =
        await fetch(
            "/api/logs",
            {
                method: "DELETE",
                headers: {
                    "x-user": user
                }
            }
        );

    const data =
        await response.json();

    alert(data.message);

    loadLogs();

}

document
    .getElementById(
        "clearLogsBtn"
    )
    .addEventListener(
        "click",
        clearLogs
    );

loadLogs();
