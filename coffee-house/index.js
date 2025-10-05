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
  } catch {
    document.querySelector('#app').innerHTML = '<h1>404</h1>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      window.location.hash = page;
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

function toggleHero() {
  const hero = document.getElementById('hero');
  const menuLink = document.querySelector('a[data-page="menu"]');
  const homeLink = document.querySelector('a[data-page="home"]');

  if (!hero || !menuLink || !homeLink) return;
  menuLink.addEventListener('click', () => {
    hero.style.display = 'none';
  });

  homeLink.addEventListener('click', () => {
    hero.style.display = 'block';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  toggleHero();
});