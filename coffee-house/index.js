//==========================CONFIG============================//
import './style.css';
import './src/pages/home.css';
import './src/pages/menu.css';
import homeTemplate from './src/pages/home.html';
import menuTemplate from './src/pages/menu.html';

const routes = {
  home: homeTemplate,
  menu: menuTemplate,
};

//==========================ROUTING===========================//

async function renderPage(page) {
  try {
    const html = routes[page];
    document.querySelector('#app').innerHTML = html;
    toggleHero(page);
    if (page === 'home') {
      initCarousel();
    } else if (page === 'menu') {
      initMenuPage();
    }
  } catch {
    document.querySelector('#app').innerHTML = '<h1>404</h1>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (href && href.startsWith('#')) return;
      e.preventDefault();

      const page = link.dataset.page;
      window.location.hash = page;
    });
  });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);

      const currentPage = window.location.hash.replace('#', '') || 'home';
      if (currentPage !== 'home') {
        e.preventDefault();
        window.location.hash = 'home';

        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }

      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const initialPage = window.location.hash.replace('#', '') || 'home';
  renderPage(initialPage);
});

window.addEventListener('hashchange', () => {
  const page = window.location.hash.replace('#', '') || 'home';
  renderPage(page);
});

//==========================HERO HIDE & BACK===========================//

function toggleHero(page) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  if (page === 'menu') {
    hero.style.display = 'none';
  } else if (page === 'home') {
    hero.style.display = 'block';
  }
}

//=============================CAROUSEL================================//

import slide1 from './src/images/favorite-coffee/coffee-slider-1.png';
import slide2 from './src/images/favorite-coffee/coffee-slider-2.png';
import slide3 from './src/images/favorite-coffee/coffee-slider-3.png';

function initCarousel() {
  const slides = [
    {
      img: slide1,
      name: "S’mores Frappuccino",
      text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50"
    },
    {
      img: slide2,
      name: "Caramel Macchiato",
      text: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
      price: "$5.00"
    },
    {
      img: slide3,
      name: "Ice coffee",
      text: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
      price: "$4.50"
    }
  ];


  const carouselImg = document.getElementById('carousel-img');
  const carouselName = document.getElementById('carousel-name');
  const carouselText = document.getElementById('carousel-text')
  const carouselPrice = document.getElementById('carousel-price')
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  if (!carouselImg) return;

  let current = 0;
  const total = slides.length;

  function updateSlide() {
    const slide = slides[current];
    carouselImg.src = slide.img;
    carouselName.textContent = slide.name;
    carouselText.textContent = slide.text;
    carouselPrice.textContent = slide.price;
  }

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % total;
    updateSlide();
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + total) % total;
    updateSlide();
  });

  setInterval(() => {
    current = (current + 1) % total;
    updateSlide();
  }, 5000);

  updateSlide();
}

// ============================MENU SHEET============================ //

function importAll(r) {
  return r.keys().map(r);
}

const images = {
  coffee: importAll(require.context('./src/images/coffee', false, /\.(png|jpe?g|svg)$/)),
  tea: importAll(require.context('./src/images/tea', false, /\.(png|jpe?g|svg)$/)),
  dessert: importAll(require.context('./src/images/dessert', false, /\.(png|jpe?g|svg)$/))
};

function initMenuPage() {
  const menuSheet = document.getElementById("menu-sheet");
  const buttons = document.querySelectorAll(".menu-buttons li a");
  const url = "https://raw.githubusercontent.com/rolling-scopes-school/qualifying-stage/main/tasks/coffee-shop-layout/products.json";
  
  let products = [];
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      products = data;
      renderGrid("coffee");
    });

  function renderGrid(category) {
    const filtered = products.filter(item => item.category === category);

    const gridHTML = `
        ${filtered.map((item, index) => `
          <div class="menu-card">
            <a href="#">
              <div class="card-img">
                <img src="${images[category][index]}" alt="${item.name}">
              </div>
              <div class="card-content">
                <div class="card-text headling-3">
                  <p class="card-name">${item.name}</p>
                  <p class="card-description medium">${item.description}</p>
                </div>
                <div class="card-content-price headling-3">
                  <p class="card-price">$${item.price}</p>
                </div>
              </div>
            </a>
          </div>
        `).join('')}
      </div>
    `;

    menuSheet.innerHTML = gridHTML;
  }

  function setActiveButton(category) {
    buttons.forEach(btn => {
      const btnCategory = btn.querySelector('p:last-child').textContent.toLowerCase();
      btn.classList.toggle('active', btnCategory === category);
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const category = btn.querySelector('p:last-child').textContent.toLowerCase();
      setActiveButton(category);
      renderGrid(category);
    });
  });
}
