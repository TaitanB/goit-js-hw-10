import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

// ============================

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  if (e.target.value.trim().length !== 0) {
    fetchCountries(e.target.value.trim())
      .then(data => createTargetCountries(data))
      .catch(error => {
        console.log(error);
        fillingData('', '');
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
  fillingData('', '');
}

function createTargetCountries(data) {
  if (data.length > 10) {
    fillingData('', '');
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    fillingData(createCountriesList(data), '');
  } else {
    fillingData('', createCountryInfo(data[0]));
  }
}

function createCountriesList(data) {
  console.log(data);
  return data
    .map(
      ({ flags, name }) =>
        `<li class="country-list__item">
        <img src="${flags.svg}" alt="${name.official}" width="40" />
        <p class="country-list__descr">${name.official}</p>
        </li>`
    )
    .join('');
}

function createCountryInfo({ name, capital, population, flags, languages }) {
  return `<img src="${flags.svg}" alt="${name.official}" width="80" />
          <p class="country-info__name">${name.official}</p>
          <p class="country-info__descr">Capital: <span class="country-info__info">${capital}</span></p>
          <p class="country-info__descr">Population: <span class="country-info__info">${population}</span></p>
          <p class="country-info__descr">Languages: <span class="country-info__info">${Object.values(
            languages
          ).join(', ')}</span></p>`;
}

function fillingData(a, b) {
  list.innerHTML = a;
  info.innerHTML = b;
}
