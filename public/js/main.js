let input = document.querySelector("#message_input");
let add = document.querySelector("#message_add");
input.addEventListener("keydown", handler);
add.addEventListener("click", handler);

if (!localStorage.getItem("user")) {
    input.placeholder = "Як вас звати?";
} else {
    input.placeholder = JSON.parse(localStorage.getItem("user", localStorage.getItem("user")));
}


let elementOutput = document.querySelector("#messages_list");

const url = "https://4bac261e-f591-4b44-aabb-c1858c507a6d-00-1liscijp3gom5.riker.replit.dev/messages/";

function handler(e) {
    if (e.code === "Enter" || e.type == "click") {
        if (!localStorage.getItem("user")) {
            if (input.value.length > 0) {
                localStorage.setItem("user", JSON.stringify(input.value));
                input.value = "Можете щось писати)";
            } else {
                return alert("Введіть ім'я не більше 10 символів");
            }
        } else {
            let userData = {
                user: JSON.parse(localStorage.getItem("user")),
                text: input.value,
                date: new Date().toLocaleString()
            };

            const requestOptions = {
                method: "POST", // Вказуємо метод PUT
                headers: {
                    "Content-Type": "application/json" // Вказуємо тип вмісту JSON
                },
                body: JSON.stringify(userData) // Перетворюємо дані в рядок JSON
            };
            fetch(url, requestOptions)
                .then(data => console.log(data)); // Робимо щось з даними
            // .catch(error => console.error(error)); // Обробляємо помилки
            input.value = "";
        }
    }
}

setInterval(() => {
    if (localStorage.getItem("user")) {
        fetch(url)
            .then(json => json.json())
            .then(data => {
                console.log(data);
                let elementCache = document.createElement("div");

                if (data.length > 1) document.querySelector("#start_message").hidden = true;

                for (let i = data.length - 1; i > data.length - 11; i--) {
                    const element = data[i];
                    // console.log(element);
                    // CREATE ELEMENT FOR MESSAGE
                    let div = document.createElement("div");
                    div.classList = "webChat_message";
                    let pUser = document.createElement("p");
                    pUser.classList = "message_user";
                    pUser.textContent = element.user;
                    let pText = document.createElement("p");
                    pText.classList = "message_text";
                    pText.textContent = element.text;
                    let pDate = document.createElement("p");
                    pDate.classList = "message_date";
                    pDate.textContent = element.date;

                    div.append(pUser);
                    div.append(pText);
                    div.append(pDate);

                    elementCache.append(div);


                }
                return elementCache.innerHTML;
            })
            .then(html => elementOutput.innerHTML = html)
    }
}, 1000);