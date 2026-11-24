'use strict';

const menuData = {
  'Fresh Juice & Soda': [
    ['Blue lime', 50], ['Watermelon', 50], ['Muskmelon', 50], ['Mint lime cooler', 40],
    ['Pineapple', 65], ['Lime soda', 40], ['Nannari soda', 45], ['Mint soda', 45],
    ['Jaljeera soda', 40], ['Chilly soda', 40]
  ],
  'Milkshake': [
    ['Banana', 60], ['KitKat', 90], ['Brownie', 100], ['Cold coffee', 65],
    ['Cold boost', 65], ['Rose milk', 60], ['Pista milk', 60], ['Badam milk', 60],
    ['Banana boone', 75], ['Mango', 99], ['Custard apple', 99]
  ],
  'Ice Cream Shake': [
    ['Vanila', 80], ['Chocolate', 95], ['Butterscotch', 95], ['Strawberry', 90],
    ['Mango', 95], ['Blackcurrant', 100], ['Brownie', 95]
  ],
  'Must Try': [
    ['Avil Milk', 65], ['Avil Special', 90], ['Sharja', 80], ['Oreo', 90],
    ['Dairy Milk', 90], ['Snickers', 90], ['Lotus Biscoff', 200], ['Tender Coconut', 95],
    ['Peanut Butter', 99], ['Peanut Oreo', 155], ['Peanut Brownie', 160]
  ],
  'Mojito': [
    ['Mint mojito', 100], ['Strawberry', 100], ['Watermelon', 100],
    ['Blue curacao', 100], ['Blue berry', 100], ['Green apple', 100]
  ],
  'Ice Tea': [
    ['Lemon Ice Tea', 70], ['Watermelon Ice Tea', 80], ['Strawberry Ice Tea', 80]
  ]
};

const tabs = document.getElementById('menuTabs');
const results = document.getElementById('menuResults');
const search = document.getElementById('menuSearch');
let activeCategory = Object.keys(menuData)[0];
let searchMode = false;

function renderTabs() {
  tabs.replaceChildren();
  Object.keys(menuData).forEach((category, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `menu-tab${category === activeCategory ? ' is-active' : ''}`;
    button.id = `tab-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(category === activeCategory));
    button.setAttribute('aria-controls', 'menuResults');
    button.textContent = category;
    button.addEventListener('click', () => {
      activeCategory = category;
      search.value = '';
      searchMode = false;
      renderTabs();
      renderMenu();
    });
    tabs.append(button);
  });
}

function createMenuItem(name, price, category) {
  const item = document.createElement('article');
  item.className = 'menu-item';
  const title = document.createElement('h3');
  title.textContent = name;
  const meta = document.createElement('span');
  meta.className = 'menu-item-meta';
  if (category) meta.textContent = category;
  const priceNode = document.createElement('p');
  priceNode.className = 'menu-price';
  priceNode.textContent = `₹${price}`;
  const nameWrap = document.createElement('div');
  nameWrap.className = 'menu-item-name';
  nameWrap.append(title);
  if (category) nameWrap.append(meta);
  item.append(nameWrap, priceNode);
  return item;
}

function renderMenu() {
  const query = search.value.trim().toLocaleLowerCase('en-IN');
  let items;
  if (query) {
    items = Object.entries(menuData).flatMap(([category, list]) =>
      list.filter(([name]) => name.toLocaleLowerCase('en-IN').includes(query))
        .map(([name, price]) => ({ name, price, category }))
    );
  } else {
    items = menuData[activeCategory].map(([name, price]) => ({ name, price }));
  }
  results.replaceChildren();
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  items.forEach(({ name, price, category }) => grid.append(createMenuItem(name, price, category)));
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'menu-empty';
    empty.textContent = 'No flavours found. Try another search.';
    results.append(empty);
  } else {
    results.append(grid);
  }
  const count = document.createElement('p');
  count.className = 'menu-count';
  count.textContent = query ? `${items.length} matching ${items.length === 1 ? 'flavour' : 'flavours'}` : `${items.length} flavours`;
  results.append(count);
}

search.addEventListener('input', () => {
  searchMode = search.value.trim().length > 0;
  renderMenu();
});

document.querySelectorAll('[data-category]').forEach((card) => {
  card.addEventListener('click', () => {
    activeCategory = card.dataset.category;
    search.value = '';
    renderTabs();
    renderMenu();
  });
});
document.querySelectorAll('[data-open-category]').forEach((link) => {
  link.addEventListener('click', () => {
    activeCategory = link.dataset.openCategory;
    search.value = '';
    renderTabs();
    renderMenu();
  });
});

// Scroll-in reveals; content remains visible when reduced motion is preferred.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

// Pointer-responsive layered hero: subtle 3D tilt on desktop, disabled for touch/reduced motion.
const stage = document.getElementById('heroStage');
if (stage && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty('--mx', `${(x * 13).toFixed(1)}px`);
    stage.style.setProperty('--my', `${(y * 9).toFixed(1)}px`);
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--mx', '0px');
    stage.style.setProperty('--my', '0px');
  });
}

const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
}));

document.getElementById('year').textContent = new Date().getFullYear();
renderTabs();
renderMenu();
