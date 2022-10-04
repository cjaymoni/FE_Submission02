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

let createTable = async (data) => {
  let table = document.getElementById("ordersTable");
  //   let li = `<tr><th>Product Name</th><th>Order Date</th><th>Order Price</th><th>Order Status</th></tr>`;
  //   await data.forEach((element) => {
  //     li += `<tr><td>${element.product?.name}</td>
  //     <td>${element.created_at}</td>

  //     <td>${element.currency}${element.total}</td><td>${element.status}</td></tr>`;
  //   });
  let result = "";
  await data.forEach((c) => {
    result += `<tr>
     <td>${c.product?.name}</td>
     <td>${c.created_at}</td>
     <td>${c.currency}${c.total}</td>
     <td>${c.status}</td>
     </tr>`;
  });
  return (table.innerHTML = result);
};

window.addEventListener("load", (event) => {
  customFetcher(API_URL + `orders?page=1`);
});
