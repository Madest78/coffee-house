import './style.css';

//==========================ROUTING===========================//

async function renderPage() {
  //TODO Load html template
}

document.querySelectorAll('a[data-link]').forEach((link) => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    await renderPage();
  })
})