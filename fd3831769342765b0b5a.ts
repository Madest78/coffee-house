/// <reference types="webpack-env" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//==========================IMPORTS============================//
import './style.css';
import './src/pages/home.css';
import './src/pages/menu.css';
import './src/pages/modal.css';
import homeTemplate from './src/pages/home.html';
import menuTemplate from './src/pages/menu.html';
import { getFavoriteCoffees } from './src/services/favorites.service';
import slide1 from './src/images/favorite-coffee/coffee-slider-1.png';
import slide2 from './src/images/favorite-coffee/coffee-slider-2.png';
import slide3 from './src/images/favorite-coffee/coffee-slider-3.png';
;
//==========================UTILS=============================//
function importAll(r) {
    return r.keys().map(r);
}
//==========================ROUTES============================//
const routes = {
    home: homeTemplate,
    menu: menuTemplate,
    modal: menuTemplate,
};
//==========================ROUTING===========================//
function renderPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const app = document.querySelector('#app');
        if (!app)
            return;
        try {
            const html = (_a = routes[page]) !== null && _a !== void 0 ? _a : '<h1>404</h1>';
            app.innerHTML = html;
            toggleHero(page);
            if (page === 'home')
                initCarousel();
            if (page === 'menu')
                initMenuPage();
        }
        catch (err) {
            app.innerHTML = '<h1>404</h1>';
            console.error(err);
        }
    });
}
function initAnchors() {
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                window.location.hash = page;
            }
        });
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            var _a, _b;
            const targetId = (_a = anchor.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.substring(1);
            if (!targetId)
                return;
            const currentPage = window.location.hash.replace('#', '') || 'home';
            if (currentPage !== 'home') {
                e.preventDefault();
                window.location.hash = 'home';
                setTimeout(() => {
                    var _a;
                    (_a = document.getElementById(targetId)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
            else {
                e.preventDefault();
                (_b = document.getElementById(targetId)) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ behavior: 'smooth' });
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
function toggleHero(page) {
    const hero = document.getElementById('hero');
    if (!hero)
        return;
    hero.style.display = page === 'menu' ? 'none' : 'block';
}
//==========================CAROUSEL===========================//
export function initCarousel() {
    return __awaiter(this, void 0, void 0, function* () {
        const carouselTrack = document.getElementsByClassName('carousel-track')[0];
        if (!carouselTrack)
            return;
        carouselTrack.innerHTML = `
    <div class="skeleton-img"></div>
    <div id="carousel-description">
      <div class="skeleton-text skeleton-name"></div>
      <div class="skeleton-text skeleton-desc"></div>
      <div class="skeleton-price"></div>
    </div>
  `;
        try {
            const coffee = yield getFavoriteCoffees();
            if (!coffee.length)
                throw new Error("No coffee found");
            const localImages = [slide1, slide2, slide3];
            const slides = coffee.map((c, i) => ({
                img: localImages[i % localImages.length],
                name: c.name,
                text: c.description,
                price: `$${c.discountPrice}`,
            }));
            yield new Promise(resolve => setTimeout(resolve, 2000));
            carouselTrack.innerHTML = `
      <img id="carousel-img" alt="slide">
      <div id="carousel-description">
        <p id="carousel-name" class="headling-3"></p>
        <p id="carousel-text" class="medium"></p>
        <p id="carousel-price" class="headling-3"></p>
      </div>
    `;
            const carouselImg = document.getElementById('carousel-img');
            const carouselName = document.getElementById('carousel-name');
            const carouselText = document.getElementById('carousel-text');
            const carouselPrice = document.getElementById('carousel-price');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            let current = 0;
            const progressBarContainer = document.querySelector('.progress-bar');
            progressBarContainer.innerHTML = slides.map(() => `<div class="carousel-line"><div class="fill"></div></div>`).join('');
            const fills = document.querySelectorAll('.carousel-line .fill');
            function updateProgress() {
                const fills = document.querySelectorAll('.carousel-line .fill');
                fills.forEach((fill, i) => {
                    if (i === current) {
                        fill.style.transition = 'width 5s linear';
                        fill.style.width = '100%';
                    }
                    else {
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
        }
        catch (err) {
            carouselTrack.innerHTML = `
      <p class="error">
        Something wrong! Plaesr reboot the page
      </p>
    `;
            console.error(err);
        }
    });
}
//==========================MENU===========================//
const images = {
    coffee: importAll(require.context('./src/images/coffee', false, /\.(png|jpe?g|svg)$/)),
    tea: importAll(require.context('./src/images/tea', false, /\.(png|jpe?g|svg)$/)),
    dessert: importAll(require.context('./src/images/dessert', false, /\.(png|jpe?g|svg)$/)),
};
function initMenuPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const menuSheet = document.getElementById('menu-sheet');
        const buttons = document.querySelectorAll('.menu-buttons li a');
        if (!menuSheet)
            return;
        let products = [];
        renderSkeleton();
        try {
            const response = yield fetch('https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products');
            if (!response.ok)
                throw new Error(`Request failed with status ${response.status}`);
            const json = yield response.json();
            products = json.data;
            yield new Promise(resolve => setTimeout(resolve, 1200));
            renderGrid('coffee');
            setActiveButton('coffee');
        }
        catch (err) {
            console.error('Loading error:', err);
            menuSheet.innerHTML = `<p class="error">Something went wrong. Please reload the page.</p>`;
            return;
        }
        function renderGrid(category) {
            const filtered = products.filter(item => item.category === category);
            menuSheet.innerHTML = filtered.map((item, index) => `
      <div class="menu-card fade-in" data-id="${item.id}">
        <a>
          <div class="card-img">
            <img src="${images[category][index % images[category].length]}" alt="${item.name}">
          </div>
          <div class="card-content">
            <div class="card-text headling-3">
              <p class="card-name">${item.name}</p>
              <p class="card-description medium">${item.description}</p>
            </div>
            <div class="card-content-price headling-3">
              <p class="card-price">
                $${item.discountPrice || item.price}
              </p>
            </div>
          </div>
        </a>
      </div>
    `).join('');
        }
        function renderSkeleton() {
            const skeletons = Array.from({ length: 6 }).map(() => `
      <div class="menu-card skeleton">
        <div class="card-img skeleton-img"></div>
        <div class="card-content">
          <div class="skeleton-text skeleton-name"></div>
          <div class="skeleton-text skeleton-desc"></div>
          <div class="skeleton-price"></div>
        </div>
      </div>
    `).join('');
            menuSheet.innerHTML = skeletons;
        }
        function setActiveButton(category) {
            buttons.forEach(btn => {
                var _a, _b;
                const ps = btn.querySelectorAll('p');
                const btnCategory = (_b = (_a = ps[1]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                btn.classList.toggle('active', btnCategory === category);
            });
        }
        buttons.forEach(btn => {
            btn.addEventListener('click', e => {
                var _a, _b;
                e.preventDefault();
                const ps = btn.querySelectorAll('p');
                const category = (_b = (_a = ps[1]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                if (!category) {
                    console.warn('Category not found');
                    return;
                }
                setActiveButton(category);
                renderGrid(category);
            });
        });
    });
}
//==========================MODAL===========================//
function loadModal() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Подгружаем HTML
        const res = yield fetch('/modal.html');
        const html = yield res.text();
        document.body.insertAdjacentHTML('beforeend', html);
        // 2. Подгружаем CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/modal.css';
        document.head.appendChild(link);
        // 3. Теперь элементы модалки реально есть
        const modal = document.getElementById('modal-overlay');
        const closeBtn = document.getElementById('modal-close');
        const modalImg = document.getElementById('modal-product-img');
        const modalName = document.getElementById('modal-product-name');
        const modalDesc = document.getElementById('modal-product-desc');
        const modalPrice = document.getElementById('modal-product-price');
        if (!modal || !closeBtn || !modalImg || !modalName || !modalDesc || !modalPrice) {
            console.error('Modal elements not found in DOM');
            return;
        }
        // 4. Навешиваем обработчики на карточки
        const cards = document.querySelectorAll('.menu-card');
        cards.forEach(card => {
            card.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const productId = card.getAttribute('data-id');
                if (!productId)
                    return;
                const response = yield fetch(`https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/products/${productId}`);
                const product = (yield response.json()).data;
                const category = product.category;
                modalImg.src = images[category][0];
                modalName.textContent = product.name;
                modalDesc.textContent = product.description;
                modalPrice.textContent = `$${parseFloat(product.discountPrice || product.price).toFixed(2)}`;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }));
        });
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initMenuPage().then(() => {
        loadModal(); // вызываем только после рендера карточек
    });
});
