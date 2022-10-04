const weeklyChart = document.getElementById("weeklyChart").getContext("2d");
const myChart = new Chart(weeklyChart, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const monthChart = document.getElementById("monthlyChart").getContext("2d");
const monthlyChart = new Chart(monthChart, {
  type: "bar",
  data: {
    labels: ["Month", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const toggleButton = document.getElementById("toggleButton");
const chart2 = document?.getElementById("monthlyChart");
const chart1 = document?.getElementById("weeklyChart");
const text1 = document?.getElementById("weekText");
const text2 = document?.getElementById("monthText");

toggleButton.addEventListener("change", toggleChart);

function toggleChart() {
  if (toggleButton.checked == true) {
    chart1.style.display = "none";
    chart2.style.display = "block";
    text1.style.display = "none";
    text2.style.display = "block";
  } else if (toggleButton.checked == false) {
    chart1.style.display = "block";
    chart2.style.display = "none";
    text1.style.display = "block";
    text2.style.display = "none";
  }
}
const API_URL = "https://freddy.codesubmit.io/";

const user_token = JSON.parse(localStorage.getItem("access_token"));
const user_refresh = JSON.parse(localStorage.getItem("refresh_token"));

async function fetchDashData() {
  let firstTry = await fetch(API_URL + "dashboard", {
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  });
  let data = await firstTry.json();
  if (firstTry.status === 401) {
    await refreshToken();
    return firstTry;
  }
  console.log(data);
}

async function refreshToken() {
  let req = await fetch(API_URL + "refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user_refresh}`,
    },
  });
  let data = await req.json();
  localStorage.setItem("access_token", JSON.stringify(data.access_token));
  return data;
}

let originalRequest = async (url, config) => {
  url = `${baseURL}${url}`;
  let response = await fetch(url, config);
  let data = await response.json();
  console.log("REQUESTING:", data);
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
  let authTokens = JSON.parse(localStorage.getItem("access_token")) ?? null;

  let refresh_token = JSON.parse(localStorage.getItem("refresh_token"));

  config["headers"] = {
    Authorization: `Bearer ${authTokens}`,
  };

  console.log("Before Request");
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
  console.log({ response, data });
  return { response, data };
};
window.addEventListener("load", (event) => {
  toggleChart();
  customFetcher(API_URL + "dashboard");
});
