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

let currentCategory = "general";

/* Dark Mode */
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* Mobile Menu */
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

/* Skeleton Loader */
function showSkeletons() {
  newsContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton";
    newsContainer.appendChild(skel);
  }
}

async function fetchNews(category = "general", query = "") {
  showSkeletons();

  let url = `${BASE_URL}&category=${category}&apiKey=${API_KEY}`;
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url));
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    displayHero(data.articles[0]);
    displayTrending(data.articles.slice(1, 6));
    displayNews(data.articles.slice(6));

  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = "<p>Error loading news.</p>";
  }
}

/* Hero */
function displayHero(article) {
  hero.style.backgroundImage = `url(${article.urlToImage || ""})`;
  heroTitle.textContent = article.title || "";
  heroDesc.textContent = article.description || "";
}

/* Trending */
function displayTrending(articles) {
  trendingContainer.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "trending-card";
    card.innerHTML = `
      <img src="${article.urlToImage || "https://via.placeholder.com/300"}">
      <h4>${article.title}</h4>
    `;
    trendingContainer.appendChild(card);
  });
}

/* News Grid */
function displayNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.urlToImage || "https://via.placeholder.com/300"}">
      <div class="content">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <small>${new Date(article.publishedAt).toDateString()}</small>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

/* Category Filter */
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    currentCategory = link.dataset.category;
    fetchNews(currentCategory);
    navMenu.classList.remove("show");
  });
});

/* Search */
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNews("", query);
});

fetchNews();
