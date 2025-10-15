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
import homeTemplate from './src/pages/home.html';
import menuTemplate from './src/pages/menu.html';
import slide1 from './src/images/favorite-coffee/coffee-slider-1.png';
import slide2 from './src/images/favorite-coffee/coffee-slider-2.png';
import slide3 from './src/images/favorite-coffee/coffee-slider-3.png';
//==========================UTILS=============================//
function importAll(r) {
    return r.keys().map(r);
}
//==========================ROUTES============================//
const routes = {
    home: homeTemplate,
    menu: menuTemplate,
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
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === null || href === void 0 ? void 0 : href.startsWith('#'))
                return;
            e.preventDefault();
            const page = link.dataset.page;
            if (page)
                window.location.hash = page;
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
                return;
            }
            (_b = document.getElementById(targetId)) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ behavior: 'smooth' });
        });
    });
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
function initCarousel() {
    const slides = [
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
    const carouselImg = document.getElementById('carousel-img');
    const carouselName = document.getElementById('carousel-name');
    const carouselText = document.getElementById('carousel-text');
    const carouselPrice = document.getElementById('carousel-price');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    if (!carouselImg || !carouselName || !carouselText || !carouselPrice || !prevBtn || !nextBtn)
        return;
    let current = 0;
    function updateSlide() {
        const slide = slides[current];
        carouselImg.src = slide.img;
        carouselName.textContent = slide.name;
        carouselText.textContent = slide.text;
        carouselPrice.textContent = slide.price;
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
    const buttons = document.querySelectorAll('.menu-buttons li a');
    if (!menuSheet)
        return;
    let products = [];
    fetch('https://raw.githubusercontent.com/rolling-scopes-school/qualifying-stage/main/tasks/coffee-shop-layout/products.json')
        .then(res => res.json())
        .then((data) => {
        products = data;
        renderGrid('coffee');
    });
    function renderGrid(category) {
        const filtered = products.filter(item => item.category === category);
        menuSheet.innerHTML = filtered.map((item, index) => `
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
    function setActiveButton(category) {
        buttons.forEach(btn => {
            var _a, _b;
            const btnCategory = (_b = (_a = btn.querySelector('p:last-child')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            btn.classList.toggle('active', btnCategory === category);
        });
    }
    buttons.forEach(btn => {
        btn.addEventListener('click', e => {
            var _a, _b;
            e.preventDefault();
            const category = (_b = (_a = btn.querySelector('p:last-child')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            setActiveButton(category);
            renderGrid(category);
        });
    });
}
