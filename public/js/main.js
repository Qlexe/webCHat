setInterval(() => {location.reload()}, 2000)

let url = "https://webchat.oleksandrkap.repl.co/messages/";
let data = [];
  fetch(url)
  .then((response) => {response.json()});
  .then((data) => {
  .then((result) => console.log(result));



let input = document.querySelector("#message_input");
  let add = document.querySelector("#message_add")
if (!localStorage.getItem("user")) {
  input.placeholder = "Як вас звати? Потім натисніть кнопку 'Ввести'.";
  input.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        if (input.value.length > 2) {
          localStorage.setItem("user", JSON.stringify(input.value));
        } else {
          return alert("Введіть ім'я більше 3 символів");
        }
    }
  });
  input.removeEventListener("keydown")
} else {
  input.placeholder = JSON.parse(localStorage.getItem("user", localStorage.getItem("user")));
}

// WRITING MESSAGES
add.addEventListener("click", function() {
  fetch(db)