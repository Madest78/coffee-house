/// <reference types="webpack-env" />

//==========================IMPORTS============================//
import './style.css';
import './src/pages/home.css';
import './src/pages/menu.css';

import homeTemplate from './src/pages/home.html';
import menuTemplate from './src/pages/menu.html';

import { getFavoriteCoffees } from './src/services/favorites.service';

import type { CoffeeProduct } from './src/types/coffee';

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

function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) {
        window.location.hash = page;
      }
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
      } else {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAnchors();
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
export async function initCarousel() {
  const carouselTrack = document.getElementsByClassName('carousel-track')[0];
  if (!carouselTrack) return;

  carouselTrack.innerHTML = `
    <div class="skeleton-img"></div>
    <div id="carousel-description">
      <div class="skeleton-text skeleton-name"></div>
      <div class="skeleton-text skeleton-desc"></div>
      <div class="skeleton-price"></div>
    </div>
  `;

  try {
    const coffee = await getFavoriteCoffees();
    if (!coffee.length) throw new Error("No coffee found");

    const localImages = [slide1, slide2, slide3];
    const slides: Slide[] = coffee.map((c, i) => ({
      img: localImages[i % localImages.length],
      name: c.name,
      text: c.description,
      price: `$${c.discountPrice}`,
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    carouselTrack.innerHTML = `
      <img id="carousel-img" alt="slide">
      <div id="carousel-description">
        <p id="carousel-name" class="headling-3"></p>
        <p id="carousel-text" class="medium"></p>
        <p id="carousel-price" class="headling-3"></p>
      </div>
    `;

    const carouselImg = document.getElementById('carousel-img') as HTMLImageElement;
    const carouselName = document.getElementById('carousel-name')!;
    const carouselText = document.getElementById('carousel-text')!;
    const carouselPrice = document.getElementById('carousel-price')!;
    const prevBtn = document.querySelector<HTMLButtonElement>('.prev')!;
    const nextBtn = document.querySelector<HTMLButtonElement>('.next')!;

    let current = 0;

    const progressBarContainer = document.querySelector('.progress-bar')!;
    progressBarContainer.innerHTML = slides.map(() => `<div class="carousel-line"><div class="fill"></div></div>`).join('');

    const fills = document.querySelectorAll<HTMLDivElement>('.carousel-line .fill');

    function updateProgress() {
      const fills = document.querySelectorAll<HTMLDivElement>('.carousel-line .fill');

      fills.forEach((fill, i) => {
        if (i === current) {
          fill.style.transition = 'width 5s linear';
          fill.style.width = '100%';
        } else {
          fill.style.transition = 'none';
          fill.style.width = '0%';
        }
      });
    }

    function updateSlide() {
      const slide = slides[current];
      carouselImg.src = slide.img;
      carouselName.textContent = slide.name;
      carouselText.textContent = slide.text;
      carouselPrice.textContent = slide.price;

      fills.forEach(fill => fill.style.transition = 'none');
      setTimeout(updateProgress, 50);
    }

    nextBtn.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      updateSlide();
    });

    prevBtn.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      updateSlide();
    });

    updateSlide();
    setInterval(() => {
      current = (current + 1) % slides.length;
      updateSlide();
    }, 5000);

  } catch (err) {
    carouselTrack.innerHTML = `
      <p class="error">
        Something wrong! Plaesr reboot the page
      </p>
    `;
    console.error(err);
  }
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
