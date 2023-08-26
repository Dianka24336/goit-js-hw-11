import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay';
import { createCardMarkup } from './js/create-cards.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBTN = document.querySelector('.load-more');
const input = form.elements[0];

form.addEventListener('submit', onSubmit);
loadBTN.addEventListener('click', onLoadBtnClick);

let searchData = '';
let page = 1;
let perPage = 40;
let totalPages = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

async function onSubmit(event) {
  event.preventDefault();

  hiddenBtn();

  resetPage();
  searchData = form.elements.searchQuery.value;

  if (!searchData) {
    Notiflix.Notify.failure('Please enter a request');
    clearPage();
    return;
  }
  try {
    resetPage();
    const dataResult = await fetchImages(page, searchData);
    //   console.log(dataResult.hits)
    totalPages = Math.ceil(dataResult.totalHits / perPage);

    if (dataResult.hits.length === 0) {
      resetPage();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearPage();
      hiddenBtn();
    }
    if (totalPages > 1) {
      showButton();
    }
    gallery.innerHTML = createCardMarkup(dataResult.hits);
    page += 1;
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadBtnClick() {
  try {
    let resultData = input.value.trim();
    if (!resultData || !page) {
      return;
    } else {
      const dataResult = await fetchImages(page, searchData);

      page += 1;
      gallery.insertAdjacentHTML(
        'beforeend',
        createCardMarkup(dataResult.hits)
      );
      lightbox.refresh();
    }

    if (page >= totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      hiddenBtn();
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function resetPage() {
  page = 1;
}

function clearPage() {
  gallery.innerHTML = '';
}

function hiddenBtn() {
  loadBTN.classList.add('is-hidden');
}
function showButton() {
  loadBTN.classList.remove('is-hidden');
}
