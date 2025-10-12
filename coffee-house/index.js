//==========================CONFIG============================//

const routes = {
  home: './src/pages/home.html',
  menu: './src/pages/menu.html'
};

//==========================ROUTING===========================//

async function renderPage(page) {
  try {
    const html = await fetch(routes[page]).then((res) => res.text());
    document.querySelector('#app').innerHTML = html;
    toggleHero(page);
    if (page === 'home') {
      initCarousel();
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

function initCarousel() {
  const slides = [
    {
      img: "/coffee-house/src/images/favorite-coffee/coffee-slider-1.png",
      name: "S’mores Frappuccino",
      text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50"
    },
    {
      img: "/coffee-house/src/images/favorite-coffee/coffee-slider-2.png",
      name: "Caramel Macchiato",
      text: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
      price: "$5.00"
    },
    {
      img: "/coffee-house/src/images/favorite-coffee/coffee-slider-3.png",
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

  updateSlide();
}