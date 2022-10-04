const pgUrl = window.location.href.substr(
  window.location.href.lastIndexOf("/") + 1
);
const sdComponent = document.querySelector(".sidebar");
if (pgUrl === "login") {
  sdComponent.style.display = "none";
}
