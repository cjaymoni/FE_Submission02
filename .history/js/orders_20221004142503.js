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

const pageSize = 3;
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
  renderTable();
}
function nextPage() {
  if (curPage * pageSize < data.length) curPage++;
  renderTable();
}
window.addEventListener("load", (event) => {
  customFetcher(API_URL + `orders?page=1`);
});