const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

const newsContainer = document.getElementById("newsContainer");
const trendingContainer = document.getElementById("trendingContainer");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const navLinks = document.querySelectorAll(".nav-links li");

const darkToggle = document.getElementById("darkToggle");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");

let currentCategory = "";

/* 🌙 Dark Mode */
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* 🍔 Mobile Menu */
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

/* ⚡ Skeleton Loader */
function showSkeletons() {
  newsContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton";
    newsContainer.appendChild(skel);
  }
}

/* 📰 Fetch News (GNews API) */
async function fetchNews(category = "", query = "") {
  showSkeletons();

  let url = `${BASE_URL}&apikey=${API_KEY}&max=10`;

  if (category) {
    url += `&topic=${category}`;
  }

  if (query) {
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=en&country=us&apikey=${API_KEY}&max=10`;
  }

  const proxyUrl =
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      trendingContainer.innerHTML = "";
      return;
    }

    displayHero(data.articles[0]);
    displayTrending(data.articles.slice(1, 6));
    displayNews(data.articles.slice(6));
  } catch (error) {
    console.error("Fetch failed:", error);
    newsContainer.innerHTML =
      "<p style='text-align:center;'>API limit reached or network error.</p>";
  }
}


/* 🎯 Hero Section */
function displayHero(article) {
  hero.style.backgroundImage = `url(${article.image || ""})`;
  heroTitle.textContent = article.title || "";
  heroDesc.textContent = article.description || "";
}

/* 🔥 Trending Slider */
function displayTrending(articles) {
  trendingContainer.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "trending-card";
    card.innerHTML = `
      <img src="${article.image || "https://via.placeholder.com/300"}">
      <h4>${article.title}</h4>
    `;
    trendingContainer.appendChild(card);
  });
}

/* 🗞 News Grid */
function displayNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.image || "https://via.placeholder.com/300"}">
      <div class="content">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <small>${new Date(article.publishedAt).toDateString()}</small>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

/* 🧭 Category Filter */
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    currentCategory = link.dataset.category || "";
    fetchNews(currentCategory);
    navMenu.classList.remove("show");
  });
});

/* 🔍 Search */
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNews("", query);
});

/* 🚀 Initial Load */
fetchNews();

