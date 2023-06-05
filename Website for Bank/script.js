'use strict';

// ------------
// selecting the elements from the html / DOM
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// header and other sections
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

// buttons and links below
const btnLearnMore = document.querySelector('.btn--scroll-to');
const allNavLinks = document.querySelectorAll('.nav__link');
const navLinksContainer = document.querySelector('.nav__links');
const allButtons = document.getElementsByTagName('button');
// the whole nav bar - for hover effect
const nav = document.querySelector('.nav');
// tabbed components in the operations section
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
// lazy Images
const lazyImages = document.querySelectorAll('img[data-src]');
// creating new element
const message = document.createElement('div');

// slider Element Selections
const allSlides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// ------------
// main coding
// opening the modal box
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ------------
// inserting element (Cookie Message) in to the web page
message.classList.add('cookie-message');
message.innerHTML = `Notice: Mini Bank use cookies to provide necessary website functionality.
  <button class="btn btn btn--close-cookie">Got it!</button>`;

header.append(message);
// header.appendChild(message)

// ------------
// deleting the element from the web
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// ------------
// smooth scrolling behaviour
const section1 = document.querySelector('#section--1');
btnLearnMore.addEventListener('click', function () {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// ------------
// navigating to the links from the nav bar
navLinksContainer.addEventListener('click', function (event) {
  event.preventDefault();
  // getting the exact links - by using Event delegation - (bubbling)
  if (event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute('href');
    // preventing the error on the link in console by opening the modal from the nav bar
    if (id === '#') return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ------------
// tabbed component in the operations ssection - section no 2
tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');
  if (!clicked) return;
  // removing the classes from tabs and contents
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // active tab
  clicked.classList.add('operations__tab--active');

  // showing the content based on the tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ------------
// hover effect on the nav bar
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== link) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// ------------
// sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(
  stickyNav,
  headerObserverOptions
);
headerObserver.observe(header);

// ------------
// revealing the secton when user is in the specific section
const sectionObserverOptions = {
  root: null,
  threshold: 0.2,
};
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  sectionObserverOptions
);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// ------------
// lazy loading images
const loadImage = function (entries, observer) {
  const [entry] = entries;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

lazyImages.forEach(function (img) {
  imageObserver.observe(img);
});

// ------------
// slider
let currentSlide = 0;
const maxSlide = allSlides.length;
const nextSlide = function (slide) {
  allSlides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
nextSlide(0);
// controling with the dots or buttons on screen
const createDots = function () {
  allSlides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();
// activate the dot based on the active slide
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0)

// next button
const goToNextSlide = function () {
  if (currentSlide === maxSlide - 1) currentSlide = 0;
  else currentSlide++;
  nextSlide(currentSlide);
  activateDot(currentSlide);
};
btnRight.addEventListener('click', goToNextSlide);

// previous Button
const goToPrevSlide = function () {
  if (currentSlide === 0) currentSlide = maxSlide - 1;
  else currentSlide--;
  nextSlide(currentSlide);
  activateDot(currentSlide)
};
btnLeft.addEventListener('click', goToPrevSlide);

// controlling slider with KeyBoard
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') goToNextSlide();
  if (event.key === 'ArrowLeft') goToPrevSlide();
});

dotsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const slide = event.target.dataset.slide;
    nextSlide(slide);
    activateDot(slide)
  }
});
