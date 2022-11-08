import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';

import countriesListTemplate from './js/hbs-templates/countriesList.hbs';
// import countryFullInfoTemplate from './js/countryFullInfo.hbs';

Notify.init({
  distance: '20px',
  cssAnimationStyle: 'from-top',
  fontSize: '16px',
  // useFontAwesome: true,
  timeout: 2000,
  backOverlay: true,
  // plainText: false,
  clickToClose: true,
});

const DEBOUNCE_DELAY = 300;

let getElement = selector => document.querySelector(selector)

const inputRef = getElement('#search-box')
const countryListRef = getElement('.country-list')
const countryInfoRef = getElement('.country-info')

// console.log(inputRef);
// console.log(countryListRef);
// console.log(countryInfoRef);

inputRef.addEventListener('input', debounce(onSearchboxInput, DEBOUNCE_DELAY));

function clearCountriesContainer() {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
}

function onSearchboxInput(event) {
    clearCountriesContainer();

    const countryName = event.target.value.trim();
    // console.log(countryName);
    fetchCountries(countryName).then(createMarkup).catch(showError)
};

function createMarkup(data) {
    // console.log(data);

    if (data.length > 10) {
        return Notify.info('Too many matches found. Please enter a more specific name.')
    };

    if (data.length > 1) {
        return renderCountriesList(data)
    };

    renderSingleCountryCard(data);
    // clearCountriesContainer()
}

function renderCountriesList(country) {
    countryListRef.innerHTML = countriesListTemplate({ country })
}

function renderSingleCountryCard(country) {

    // console.log(...country);
    // const { name, flags, population, capital, languages } = country

    const name = country[0].name.official;
    const capital = country[0].capital[0];
    const population = country[0].population;
    const flag = country[0].flags.svg;
    const languages = Object.values(country[0].languages).join(', ');

    // console.log(languages);

   const singleCountryMarkup = `<div class="country-info__container">
        <div class="country-info__title">
          <img src="${flag}" alt="${name}" class="country-list__image" />
          <h2>${name}</h2>
        </div>
        <div class="country-info__description">
          <p><span class="country-info__subtitle">Capital:</span>${capital}</p>
          <p><span class="country-info__subtitle">Population:</span>${population}</p>
          <p><span class="country-info__subtitle">Languages:</span>${languages}</p>
        </div>
      </div>`
    
    countryInfoRef.innerHTML = singleCountryMarkup;
}


function showError(error) {
    console.log(error);
    Notify.failure('Oops, there is no country with that name')
};

// fetch('https://restcountries.com/v3.1/name/sweden?fields=name,capital,population,flags,languages').then(responce => responce.json()).then(data => console.log(data))
