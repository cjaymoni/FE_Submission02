const form = document.querySelector("form");

const API_URL = "https://freddy.codesubmit.io/login";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  loginEvent(data);
});

function loginEvent(formData) {
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      localStorage.setItem("access_token", JSON.stringify(data.access_token));
      localStorage.setItem("refresh_token", JSON.stringify(data.refresh_token));

      window.location.assign("/dashboard");
    })
    .catch((err) => JSON.stringify(err));
}
