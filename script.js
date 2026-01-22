const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

const newsContainer = document.getElementById("newsContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const navLinks = document.querySelectorAll(".nav-links li");

let currentCategory = "general";

// Fetch news from API
async function fetchNews(category = "general", query = "") {
  newsContainer.innerHTML = "<p style='text-align:center;'>Loading...</p>";

  let url = `${BASE_URL}&category=${category}&apiKey=${API_KEY}`;
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message);
    }

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p style='text-align:center;'>No news found.</p>";
      return;
    }

    // Cache data
    localStorage.setItem("cachedNews", JSON.stringify(data.articles));

    displayHero(data.articles[0]);
    displayNews(data.articles.slice(1));
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = "<p style='text-align:center;'>Error loading news. Showing cached results.</p>";

    const cached = localStorage.getItem("cachedNews");
    if (cached) {
      const articles = JSON.parse(cached);
      displayHero(articles[0]);
      displayNews(articles.slice(1));
    }
  }
}

// Display featured article
function displayHero(article) {
  if (!article) return;

  hero.style.backgroundImage = `url(${article.urlToImage || "https://via.placeholder.com/800x400"})`;
  heroTitle.textContent = article.title || "";
  heroDesc.textContent = article.description || "";
}

// Display news cards
function displayNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <img src="${article.urlToImage || "https://via.placeholder.com/300"}" alt="news">
      <div class="content">
        <h3>${article.title || ""}</h3>
        <p>${article.description || ""}</p>
        <small>${new Date(article.publishedAt).toDateString()}</small>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}

// Category click
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    currentCategory = link.dataset.category;
    fetchNews(currentCategory);
  });
});

// Search click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchNews("", query);
  }
});

// Initial load
fetchNews();
