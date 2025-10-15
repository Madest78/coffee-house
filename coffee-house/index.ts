/// <reference types="webpack-env" />

//==========================IMPORTS============================//
import './style.css';
import './src/pages/home.css';
import './src/pages/menu.css';

import homeTemplate from './src/pages/home.html';
import menuTemplate from './src/pages/menu.html';

import slide1 from './src/images/favorite-coffee/coffee-slider-1.png';
import slide2 from './src/images/favorite-coffee/coffee-slider-2.png';
import slide3 from './src/images/favorite-coffee/coffee-slider-3.png';

//==========================TYPES=============================//
type Slide = {
  img: string;
  name: string;
  text: string;
  price: string;
};

type Product = {
  name: string;
  description: string;
  category: 'coffee' | 'tea' | 'dessert';
  price: number;
};

//==========================UTILS=============================//
function importAll<T = string>(r: __WebpackModuleApi.RequireContext): T[] {
  return r.keys().map(r) as T[];
}

//==========================ROUTES============================//
const routes: Record<string, string> = {
  home: homeTemplate,
  menu: menuTemplate,
};

//==========================ROUTING===========================//
async function renderPage(page: string) {
  const app = document.querySelector<HTMLElement>('#app');
  if (!app) return;

  try {
    const html = routes[page] ?? '<h1>404</h1>';
    app.innerHTML = html;
    toggleHero(page);

    if (page === 'home') initCarousel();
    if (page === 'menu') initMenuPage();
  } catch (err) {
    app.innerHTML = '<h1>404</h1>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll<HTMLAnchorElement>('a[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) return;
      e.preventDefault();
      const page = link.dataset.page;
      if (page) window.location.hash = page;
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href')?.substring(1);
      if (!targetId) return;

      const currentPage = window.location.hash.replace('#', '') || 'home';
      if (currentPage !== 'home') {
        e.preventDefault();
        window.location.hash = 'home';
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  renderPage(window.location.hash.replace('#', '') || 'home');
});

window.addEventListener('hashchange', () => {
  renderPage(window.location.hash.replace('#', '') || 'home');
});

//==========================HERO===========================//
function toggleHero(page: string) {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.style.display = page === 'menu' ? 'none' : 'block';
}

//==========================CAROUSEL===========================//
function initCarousel() {
  const slides: Slide[] = [
    {
      img: slide1,
      name: "S’mores Frappuccino",
      text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50",
    },
    {
      img: slide2,
      name: "Caramel Macchiato",
      text: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
      price: "$5.00",
    },
    {
      img: slide3,
      name: "Ice coffee",
      text: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
      price: "$4.50",
    },
  ];

  const carouselImg = document.getElementById('carousel-img') as HTMLImageElement | null;
  const carouselName = document.getElementById('carousel-name');
  const carouselText = document.getElementById('carousel-text');
  const carouselPrice = document.getElementById('carousel-price');
  const prevBtn = document.querySelector<HTMLButtonElement>('.prev');
  const nextBtn = document.querySelector<HTMLButtonElement>('.next');

  if (!carouselImg || !carouselName || !carouselText || !carouselPrice || !prevBtn || !nextBtn) return;

  let current = 0;

  function updateSlide() {
    const slide = slides[current];
    carouselImg!.src = slide.img;
    carouselName!.textContent = slide.name;
    carouselText!.textContent = slide.text;
    carouselPrice!.textContent = slide.price;
  }

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    updateSlide();
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlide();
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    updateSlide();
  }, 5000);

  updateSlide();
}

//==========================MENU===========================//
const images = {
  coffee: importAll(require.context('./src/images/coffee', false, /\.(png|jpe?g|svg)$/)),
  tea: importAll(require.context('./src/images/tea', false, /\.(png|jpe?g|svg)$/)),
  dessert: importAll(require.context('./src/images/dessert', false, /\.(png|jpe?g|svg)$/)),
};

function initMenuPage() {
  const menuSheet = document.getElementById('menu-sheet');
  const buttons = document.querySelectorAll<HTMLAnchorElement>('.menu-buttons li a');
  if (!menuSheet) return;

  let products: Product[] = [];

  fetch('https://raw.githubusercontent.com/rolling-scopes-school/qualifying-stage/main/tasks/coffee-shop-layout/products.json')
    .then(res => res.json())
    .then((data: Product[]) => {
      products = data;
      renderGrid('coffee');
    });

  function renderGrid(category: keyof typeof images) {
    const filtered = products.filter(item => item.category === category);

    menuSheet!.innerHTML = filtered.map((item, index) => `
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
    `).join('');
  }

  function setActiveButton(category: keyof typeof images) {
    buttons.forEach(btn => {
      const btnCategory = btn.querySelector('p:last-child')?.textContent?.toLowerCase();
      btn.classList.toggle('active', btnCategory === category);
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const category = btn.querySelector('p:last-child')?.textContent?.toLowerCase() as keyof typeof images;
      setActiveButton(category);
      renderGrid(category);
    });
  });
}
