const user = localStorage.getItem("user");

if (!user) {

    location.replace("/");

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

document.getElementById("currentUser").textContent = user;

document.getElementById("logoutBtn").addEventListener(
    "click",
    () => {

        localStorage.removeItem("user");

        location.replace("/");

    }
);

loadQuota();
