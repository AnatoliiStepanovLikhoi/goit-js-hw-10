const URL = 'https://restcountries.com/v3.1/name/'
const FILTERS = '?fields=name,capital,population,flags,languages'

export default function fetchCountries(name) {
    return fetch(URL + name + FILTERS).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json()
    });
};