import axios from 'axios';

const URL = 'http://localhost:1234';

// const get = route =>
//   axios.get(`${URL}/${route}`)
//     .then(response => response.data.results);

const post = (route, data) =>
  axios.post(`${URL}/${route}`, data)
    .then(response => response.data.results);

export const registerNewWizard = name =>
  post('newWizard', {
    name,
  });

export const updateLocation = location =>
  post('updateLocation', {
    location,
  });
