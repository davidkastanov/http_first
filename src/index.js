import _ from 'lodash';
import { alert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

defaultModules.set(PNotifyMobile, {});

const API_URL = "https://restcountries.com/v2";

const inputEl = document.querySelector("#input");
const boxEl = document.querySelector("#box");

inputEl.addEventListener("input", _.debounce(inputSearch, 500));

function inputSearch(event) {
    boxEl.innerHTML = '';
    const query = event.target.value.trim();
    if (!query) return;

    fetch(`${API_URL}/name/${query}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                if (data.length > 10) {
                    alert({ text: 'Too many matches found. Please enter a more specific query!' });
                } else if (data.length >= 2 && data.length <= 10) {
                    renderCountries(data);
                } else if (data.length === 1) {
                    renderCountry(data);
                }
            } else {
                boxEl.innerHTML = '<p class="error-msg">Країну не знайдено</p>';
            }
        })
        .catch(error => {
            console.warn(error.message);
        });
};

function renderCountries(countries) {
    boxEl.innerHTML = '';
    countries.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="box-el">
              <h3 class="box-title">${item.name}</h3>
              <p class="box-description">${item.alpha2Code}</p>
              <img src="${item.flags.svg}" alt="${item.alpha2Code}" class="box-img">
            </div>`;
        boxEl.appendChild(div);
    });
}


function renderCountry(countries) {
    boxEl.innerHTML = '';
    countries.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `

<div class="box-el">
    <h3 class="box-title box-title-big">${item.name}</h3>
    <div class="box-el-box"><div>

        <div><p><strong>Capital: </strong> ${item.capital}</p></div>
        <div><p><strong>Population: </strong> ${item.population}</p></div>
        <div class="box-el-langs">

            <p><strong>Languages: </strong></p>
            <ul>${item.languages.map(item => `<li>${item.name}</li>`).join('')}</ul>
        </div>
    </div><img src="${item.flag}" alt="${item.alpha2Code}" class=""></div>
</div>

`;
        boxEl.appendChild(div);
    });
}