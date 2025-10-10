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
