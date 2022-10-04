const pgUrl = window.location.href.substr(
  window.location.href.lastIndexOf("/") + 1
);
const sdComponent = document.querySelector(".sidebar");

if (pgUrl != "orders" && pgUrl != "dashboard") {
  sdComponent.style.display = "none";
}

const logOutBtn = document.getElementById("logOut");
logOutBtn.addEventListener("click", logOut);
function logOut() {
  localStorage.clear();
  window.location.replace("/");
}
