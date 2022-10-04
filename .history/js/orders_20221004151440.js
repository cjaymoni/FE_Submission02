const API_URL = "https://freddy.codesubmit.io/";

const user_token = JSON.parse(localStorage.getItem("access_token"));
const user_refresh = JSON.parse(localStorage.getItem("refresh_token"));

let ordersData = [];

let originalRequest = async (url, config) => {
  url = `${url}`;
  let response = await fetch(url, config);
  let data = await response.json();
  // console.log("REQUESTING:", data);
  return { response, data };
};

let refreshToken = async (refreshToken) => {
  let response = await fetch(API_URL + "refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  let data = await response.json();
  localStorage.setItem("access_token", JSON.stringify(data.access_token));
  return data;
};

let customFetcher = async (url, config = {}) => {
  let authTokens = JSON.parse(localStorage.getItem("access_token"));

  let refresh_token = JSON.parse(localStorage.getItem("refresh_token"));

  config["headers"] = {
    Authorization: `Bearer ${authTokens}`,
  };

  let { response, data } = await originalRequest(url, config);
  console.log("After Request");

  if (response.status === 401) {
    authTokens = await refreshToken(refresh_token);

    config["headers"] = {
      Authorization: `Bearer ${authTokens}`,
    };

    let newResponse = await originalRequest(url, config);
    response = newResponse.response;
    data = newResponse.data;
  }
  ordersData = data;

  console.log(ordersData);

  createTable(ordersData?.orders);

  return response, data;
};

const pageSize = 10;
let curPage = 1;

let createTable = async (data) => {
  let table = document.querySelector("#ordersTable tbody");

  let result = "";
  await data
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;
      let end = curPage * pageSize;
      if (index >= start && index < end) return true;
    })
    .forEach((c) => {
      result += `<tr>
     <td>${c.product?.name}</td>
     <td>${c.created_at}</td>
     <td>${c.currency}${c.total}</td>
     <td>${c.status}</td>
     </tr>`;
    });
  return (table.innerHTML = result);
};
document
  .querySelector("#nextButton")
  .addEventListener("click", nextPage, false);
document
  .querySelector("#prevButton")
  .addEventListener("click", previousPage, false);

function previousPage() {
  if (curPage > 1) curPage--;
  createTable(ordersData?.orders);
}
function nextPage() {
  if (curPage * pageSize < ordersData?.orders.length) curPage++;
  createTable(ordersData?.orders);
}
const searchInput = document.getElementById("searchInput");
const clearIcon = document.getElementById("clearIcon");

clearIcon.addEventListener("click", () => {
  searchInput.value = "";
  customFetcher(API_URL + `orders?page=1`);
});

searchInput.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  if (searchString.length > 1) {
    clearIcon.style.display = "block";
    customFetcher(API_URL + `orders?page=1&q=${searchString}`);
  }

  //   const filteredOrders = ordersData?.orders.filter((order) => {
  //     return (
  //       order.product.name.toLowerCase().includes(searchString) ||
  //       order.status.toLowerCase().includes(searchString)
  //     );
  //   });
  //   createTable(filteredOrders);
});
window.addEventListener("load", (event) => {
  customFetcher(API_URL + `orders?page=1&q=${searchInput.value}`);
  clearIcon.style.display = "none";
});
