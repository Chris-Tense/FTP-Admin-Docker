const user =
    localStorage.getItem("user");

const isAdmin =
    localStorage.getItem("isAdmin");

if (!user) {

    location.replace("/");

}

if (isAdmin !== "true") {

    location.replace(
        "/admin/dashboard-cliente.html"
    );

}

document.getElementById("currentUser").textContent = user;

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem("user");

            location.replace("/");

        }
    );
