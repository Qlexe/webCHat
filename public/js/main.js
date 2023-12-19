// setInterval(() => {location.reload()}, 2000)

let input = document.querySelector("#message_input");
let add = document.querySelector("#message_add")
if (!localStorage.getItem("user")) {
    input.placeholder = "Як вас звати? Потім натисніть кнопку 'Ввести'.";
    input.addEventListener("keydown", function (event) {
        if (event.code === "Enter") {
            if (input.value.length > 2) {
                localStorage.setItem("user", JSON.stringify(input.value));
            } else {
                return alert("Введіть ім'я більше 3 символів");
            }
        }
    });
    // input.removeEventListener("keydown")
} else {
    input.placeholder = JSON.parse(localStorage.getItem("user", localStorage.getItem("user")));
}

// WRITING MESSAGES
add.addEventListener("click", function () {
    const url = "https://webchat.oleksandrkap.repl.co/messages/";
    // let data = [];
    let userData = {
        user: JSON.parse(localStorage.getItem("user")),
        message: input.value,
        time: new Date().toLocaleString()
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
})