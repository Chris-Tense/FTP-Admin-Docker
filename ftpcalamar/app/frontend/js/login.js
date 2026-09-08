document
    .getElementById("loginForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                localStorage.setItem(
                    "user",
                    data.user
                );

                localStorage.setItem(
                    "isAdmin",
                    data.isAdmin
                );

                alert("Login correcto");

                if (data.isAdmin) {

                    window.location.href =
                        "/admin/dashboard.html";

                } else {

                    window.location.href =
                        "/admin/dashboard-cliente.html";

                }


            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Error al conectar con el servidor");

        }

    });
