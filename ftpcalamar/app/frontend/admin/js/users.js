const user =
    localStorage.getItem("user");

if (user !== "admin") {

    location.replace(
        "/admin/dashboard-cliente.html"
    );

}

async function loadUsers() {

    const response = await fetch(
        "/api/users",
        {
            headers: {
                "x-user": user
            }
        }
    );    

    const users = await response.json();

    const div = document.getElementById("users");

    div.innerHTML = "";

    users.forEach(user => {

        const row = document.createElement("div");

        row.style.margin = "10px 0";

        row.innerHTML = `
            👤 ${user}
            <button class="delete-btn">
                Eliminar
            </button>
        `;

        row
            .querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => deleteUser(user)
            );

        div.appendChild(row);

    });

}

document
    .getElementById("userForm")
    .addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById("username").value;

            const password =
                document.getElementById("password").value;
            
            const response = await fetch(
                "/api/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user": user
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
      
            await loadUsers();

        }
    );

async function deleteUser(username) {

    if (
        !confirm(
            `¿Eliminar usuario ${username}?`
        )
    ) {
        return;
    }

    const response = await fetch(
        `/api/users/${username}`,
        {
            method: "DELETE",
            headers: {
                "x-user": user
            }
        }
    );
    
    const data = await response.json();

    alert(data.message);

    await loadUsers();

}

window.deleteUser = deleteUser;

loadUsers();
     
