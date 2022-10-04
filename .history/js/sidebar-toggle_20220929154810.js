const pgUrl = window.location.href.substr(
  window.location.href.lastIndexOf("/") + 1
);
const sdComponent = document.querySelector(".sidebar");
if (pgUrl !== "orders" || pgUrl !== "dashboard") {
  sdComponent.style.display = "none";
}
